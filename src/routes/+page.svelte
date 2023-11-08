<script lang="ts">
  //todo:
  //after connecting succeeds, wait 2 sec and navigate to dashboard.   {() => goto('/dashboard')}

  //move rune into same window as the address so it makes sense.

  //figure out if connect state is already shared among the website, like will dashboard be connected, or do i need to export something?

  //style this page later.

  import Lnmessage from 'lnmessage'
  import { parseNodeAddress } from './utils.js'
  import { goto } from '$app/navigation'
  import { LnStore } from '../stores/LnStore.js'
  import { PublicKeyStore, RuneStore } from '../stores/NodeStore.js'

  let ln: Lnmessage
  let connectionStatus$: Lnmessage['connectionStatus$']

  $: if (ln) {
    connectionStatus$ = ln.connectionStatus$
  }

  let address: string
  let rune: string
  let method: string
  let params: string
  let result: string

  async function connect() {
    const { publicKey, ip, port } = parseNodeAddress(address)

    // https://github.com/aaronbarnardsound/lnmessage#initialisation
    ln = new Lnmessage({
      // The public key of the node you would like to connect to
      remoteNodePublicKey: publicKey,
      // WebSocket proxy endpoint to connect through if running in prod
      // wsProxy: 'wss://<WEBSOCKET_PROXY>',
      // The IP address of the node
      ip,
      // The port of the node, defaults to 9735
      port,
      // connect directly to a node without TLS
      wsProtocol: 'ws:',
      logger: {
        info: console.log,
        error: console.error,
        warn: console.warn
      }
    })

    LnStore.set(ln)

    ln.connect()
      .then((isConnected) => {
        if (isConnected) {
          PublicKeyStore.set(publicKey)
          RuneStore.set(rune)
          navigateToDashboard();
        } else {
          alert("connection error")
        }
      })
      .catch((error) => {
        console.error('An error occurred while connecting to the node:', error.message)
      })
  }

  function navigateToDashboard() {
    goto('/dashboard')
  }
</script>

<main class="w-screen h-screen m-8">
  {#if ln}
    <div class="absolute top-1 right-1 px-2 py-1 border-green-600 rounded border text-sm">
      Browser Id: {`${ln.publicKey.slice(0, 8)}...${ln.publicKey.slice(-8)}`}
    </div>
  {/if}

  <h1>Welcome to CLN Bookkeeper Dashboard</h1>

  <div class="w-1/2 max-w-lg">
    <div class="w-full mt-4 text-sm p-4 border-2 rounded border-purple-300">
      <label class="text-neutral-600 font-medium mb-1 block" for="address">Address</label>
      <textarea
        id="address"
        class="border w-full p-2 rounded"
        rows="3"
        bind:value={address}
        placeholder="033f4bbfcd67bd0fc858499929a3255d063999ee23f4c5e12b8b1089e132b3e408@localhost:7272"
      />

      <label class="text-neutral-600 font-medium mb-1 block" for="rune">Rune</label>
      <textarea
        id="rune"
        class="border w-full p-2 rounded"
        rows="2"
        bind:value={rune}
        placeholder="O2osJxV-6lGUgAf-0NllduniYbq1Zkn-45trtbx4qAE9MA=="
      />

      <div class="flex items-center justify-between w-full">
        <button
          on:click={connect}
          disabled={!address}
          class="mt-2 border border-purple-500 rounded py-1 px-4 disabled:opacity-20 hover:shadow-md active:shadow-none"
          >Connect</button
        >

        {#if connectionStatus$}
          <div class="flex items-center">
            <div class="text-sm">{$connectionStatus$}</div>
            <div
              class:bg-green-500={$connectionStatus$ === 'connected'}
              class:bg-yellow-500={$connectionStatus$ === 'connecting' ||
                $connectionStatus$ === 'waiting_reconnect'}
              class:bg-red-500={$connectionStatus$ === 'disconnected'}
              class="w-3 h-3 rounded-full ml-1 transition-colors"
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
