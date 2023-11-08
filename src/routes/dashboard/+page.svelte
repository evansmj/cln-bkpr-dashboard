<script lang="ts">
  import Drawer, { AppContent, Content, Header, Title, Subtitle, Scrim } from '@smui/drawer'
  //import Button, { Label } from '@smui/button'
  import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list'
  import Button, { Label } from '@smui/button'
  import MainFragment from './main.svelte'
  import CommandFragment from './command.svelte'

  //import dashboard database wrapper

  //read stuff when needed

  //how do i transfer what was read to the views?  just use the variable in the html.
  //then just listen to some variable that will be constantly updated with the state.

  let selectedDrawerContent = 'none'
</script>

<main class="w-screen h-screen">
  <div class="drawer-container">
    <Drawer>
      <Header>
        <Title>CLN Book Keeper Dashboard</Title>
        <Subtitle>Some description.</Subtitle>
      </Header>
      <Content>
        <List>
          <Item on:click={() => (selectedDrawerContent = 'MainFragment')}>
            <Graphic class="material-icons" aria-hidden="true">Inbox</Graphic>
            <Text class="list-item">Main page</Text>
          </Item>
          <Item on:click={() => (selectedDrawerContent = 'CommandFragment')}>
            <Graphic class="material-icons" aria-hidden="true">Inbox</Graphic>
            <Text class="list-item">Command page</Text>
          </Item>
          <Item on:click={() => (selectedDrawerContent = 'third')}>
            <Graphic class="material-icons" aria-hidden="true">Inbox</Graphic>
            <Text class="list-item">Third page</Text>
          </Item>
        </List>
      </Content>
    </Drawer>

    <AppContent class="app-content">
      {#if selectedDrawerContent === 'MainFragment'}
        <MainFragment />
      {:else if selectedDrawerContent === 'CommandFragment'}
        <CommandFragment />
      {:else}
        <div>no content selected.</div>
      {/if}
    </AppContent>
  </div>
</main>

<style>
  .drawer-container {
    height: 100%;
    width: 100%;
    background-color: cadetblue;
    position: relative;
    display: flex;
    overflow: hidden;
    z-index: 0;
  }

  :global(.app-content) {
    flex: 1;
    overflow: auto;
    position: relative;
  }

  :global(.mdc-drawer) {
    border-style: none;
  }

  :global(.mdc-drawer .mdc-drawer__content) {
    background-color: #000000;
  }

  :global(.list-item) {
    color: aliceblue;
  }
</style>
