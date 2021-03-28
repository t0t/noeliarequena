<script>
    import { link } from 'svelte-spa-router'
	import active from 'svelte-spa-router/active'

    import { afterUpdate } from 'svelte';
    import {clickOutside} from './clickOutside.js';
    import SiteLogo from '../SiteLogo.svelte'

    let currentitem, y;
    let activemenu = false;
    
    afterUpdate(() => { 
        if ( y > 100 && y < 500 ) { 
            currentitem = "" 
        }
    });
    
    function cuandoClick(event) {
        currentitem = event.path[0].hash
    }
    function contraeMainMenu() {
		activemenu = false
	}
    
	let current_page_name;

</script>

<style lang="scss">
	@use "../../../sass/_index.scss" as *;
    .active {
        color: $white;
		font-weight: bold;
	}
    .MainNav {
        display: none;
        position: fixed;
        top: $h4 + $h1;
        left: $h0;
        z-index: 500;
        list-style: none;
        padding-top: $h0;
        padding-bottom: $h0;
        @include type-setting(0);
        background-color: rgba(0,0,0,0.75);

        .NavItem {
            text-decoration: none;
            user-select: none;
            padding: $h0 $h2;
            display: block;
            border: none;
            &:hover {
                color: $white;
            }
        }
    }
    .MainNavVisible {
        display: flex;
        flex-wrap: wrap;
        /* min-height: 150px; */
        justify-content: space-between;
        flex-direction: column;
        @include animation(slide);
    }
    .ButtonNav {
        position: fixed;
        z-index: 1000;
        top: $h2;
        left: $h2;
        &:hover {
            cursor: pointer;
        }
    }
    button {
        color: $grey_1;
    }
    nav a {
        border: none;
    }
</style>

<svelte:window bind:scrollY={y} />

<div use:clickOutside on:click_outside={contraeMainMenu}>

    <div class="ButtonNav" on:click={() => { activemenu = !activemenu}}>
        <SiteLogo />
    </div>

    <nav class="{activemenu ? "MainNav MainNavVisible" : "MainNav"}">
        <a 
        class:active 
        class="NavItem"
        id="0" 
        role="navigation" 
        href="/" 
        use:link 
        use:active
        > Presentation </a>

        <a class="NavItem" id="1" role="navigation" 
        href="/artwork" use:link use:active> Artwork </a>

        <a class="NavItem" id="2" role="navigation" 
        href="/playground" use:link use:active> Playground </a>
        
        <a class="NavItem" id="3" role="navigation" 
        href="/about" use:link use:active> About </a>
    </nav>

</div>