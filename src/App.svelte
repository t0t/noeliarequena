<script>
	import Router from 'svelte-spa-router';
	import routes from './routes';

	import Nav from "./components/generic/nav/Nav.svelte";
	import Links from "./components/generic/Links.svelte";
	
	import Loading from './components/generic/Loading.svelte';
	import { onMount, onDestroy } from "svelte"
    
	let loaded;
	const loading = () => {
		loaded = true;
	};
  
    onMount(() => {
        loaded = false;
    })
    onDestroy(() => {
        console.log("DESTROYED")
    })
</script>

<style lang="scss">
	@use "sass/_index.scss" as *;
	
	:global(body) {
		margin: 0;
		background-color: $grey_4;
		box-sizing: border-box;
		position: relative;
		width: 100%;
		overflow-x: hidden;
	}
	:global(html) {
		font-size: $base_font_size;
		position: relative;
		width: 100%;
		height: 100%;
	}

</style>

<svelte:head>
  <meta property="og:title" content="Sergio Forés" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="sergiofores.es" />
</svelte:head>
<svelte:window on:load={loading} />

<main style="
text-align: center;
padding-top: 100px;

">
	{#if loaded} 
		<h1>noeliarequena.com</h1>
		<h2>Web disponible próximamente</h2>
		<!-- <Nav />
		<Router 
		{routes} 
		restoreScrollState={true} 
		/> -->
		<Links />
	{:else} <Loading /> {/if}
	<!-- {#if loaded} <Loading /> {/if} -->
</main>