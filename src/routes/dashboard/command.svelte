<script lang="ts">
  import type Lnmessage from 'lnmessage'
  import { parseNodeAddress } from '.././utils.js'
  import { goto } from '$app/navigation'
  import { LnStore } from '../../stores/LnStore.js'
  import { RuneStore } from '../../stores/NodeStore.js'

  let ln: Lnmessage
  LnStore.subscribe(value => {
    ln = value
  })

  let rune: string
  RuneStore.subscribe(value => {
    rune = value
  })

  let connectionStatus$: Lnmessage['connectionStatus$']

  $: if (ln) {
    connectionStatus$ = ln.connectionStatus$
  }

  let address: string
  let method: string
  let params: string
  let result: string

  async function request() {
    let parsedParams: unknown | undefined

    try {
      parsedParams = params ? JSON.parse(params) : undefined

      console.log(`ln.commando method:${method}\nparams:${params}\n${rune} `)

      const requestResult = await ln.commando({
        method,
        params: parsedParams,
        rune//,
        //reqId: id,
      })

      result = JSON.stringify(requestResult, null, 2)
    } catch (error) {
      const { message } = error as { message: string }
      alert(message)
      return
    }
  }
</script>

<div class="m-6">
  <div>
    RPC Command Prompt
  </div>
  <div class="flex-container">
    <div class="p-4 w-1/2 ml-5">
      <div class="w-full text-sm">
        <label class="text-neutral-600 font-medium mb-1 block" for="method">Method</label>
        <input
          id="method"
          class="border w-full p-2 rounded"
          type="text"
          bind:value={method}
          placeholder="getinfo"
        />
      </div>

      <div class="w-full mt-4 text-sm">
        <label class="text-neutral-600 font-medium mb-1 block" for="params">Params</label>
        <textarea
          id="params"
          class="border w-full p-2 rounded"
          rows="4"
          bind:value={params}
          placeholder={JSON.stringify({ key: 'value' }, null, 2)}
        />
      </div>

      <button
        on:click={request}
        disabled={!method}
        class="mt-2 border border-purple-500 rounded py-1 px-4 disabled:opacity-20 hover:shadow-md active:shadow-none"
        >Request</button
      >
    </div>

    <div class="w-1/2 max-w-xl p-4 ml-4">
      <div class="w-full text-sm">
        <label class="text-neutral-600 font-medium mb-1 block" for="params">Result</label>
        <textarea
          id="params"
          class="border w-full p-2 rounded"
          rows="20"
          value={result || ''}
          placeholder={JSON.stringify({ key: 'value' }, null, 2)}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .flex-container {
    height: auto;
    align-items: stretch;
    display: flex;
  }
</style>
