<script>
    import { link } from 'svelte-spa-router'
	import active from 'svelte-spa-router/active'
    // import {push} from 'svelte-spa-router'
</script>

<nav>
    <!-- <button on:click={() => push('/artwork')}>Go somewhere</button> -->
    <a href="/artwork" use:link use:active>
        <h2>Artwork</h2>
        <p>3D-Printed Paintings</p>
    </a>
    <a href="/playground" use:link use:active>
        <h2>Playground</h2>
        <p>Frontend Laboratory</p>
    </a>
    <a href="/about" use:link use:active>
        <h2>Philosophy</h2>
        <p>About me and +0+1234</p>
    </a>
</nav>

<style lang="scss">
    @use "../../../sass/_index.scss"as *;

    nav {
        display: grid;
        grid-template-columns: repeat(auto-fill, 300px);
        gap: $h4;
        justify-content: center;
        align-content: center;
        background-color: $highlight;
        width: 100%;
        padding: $h4 0;
        margin-left: auto;
        margin-right: auto;
        
        a {
            text-align: center;
            /* display: block; */
            width: 100%;
            border: none;
            color: $grey_5;
            p {
                text-align: center;
            }
        }
    }
</style>