<script>
    import { link } from 'svelte-spa-router'
	import active from 'svelte-spa-router/active'
    // import {push} from 'svelte-spa-router'
</script>

<nav>
    <!-- <button on:click={() => push('/artwork')}>Go somewhere</button> -->
    <a href="/artwork" use:link use:active>
        <h2>Obra plástica 2020-2021</h2>
        <p>Artwork</p>
    </a>
    <a href="/about" use:link use:active>
        <h2>Biografía</h2>
        <p>Biography</p>
    </a>
</nav>

<style lang="scss">
    @use "../../../sass/_index.scss"as *;

    nav {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax($h8, 1fr));
        gap: $h4;
        justify-content: center;
        align-content: center;
        background-color: $highlight;
        width: 100%;
        padding: $h4;
        margin-left: auto;
        margin-right: auto;
        
        a {
            padding: $h4;
            text-align: center;
            display: block;
            border: 1px dashed black;
            width: 100%;
            color: $grey_5;
            p {
                text-align: center;
            }
        }
    }
</style>