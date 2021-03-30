<script>
    import { link } from 'svelte-spa-router'
	import active from 'svelte-spa-router/active'
    // import {push} from 'svelte-spa-router'
</script>

<nav>
    <!-- <button on:click={() => push('/artwork')}>Go somewhere</button> -->
    <a href="/artwork" use:link use:active>
        <h2>Obra plástica</h2>
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
        padding: $h1 0;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        background-color: $white;
        
        @include media(s1) {
            /* background-color: $highlight; */
            /* padding: $h3; */
        }
        @include media(s2) {
            display: grid;
            align-content: center;
            justify-content: center;
            background-color: $highlight;
            padding: $h4;
            grid-template-columns: repeat(auto-fill, minmax($h8, 1fr));
            gap: $h4;
        }
        
        a {
            padding: 0;
            text-align: center;
            display: block;
            border: none;
            width: 100%;
            color: $grey_5;
            &:nth-child(1) {
                margin-bottom: $h0;
            }
            p {
                text-align: center;
                margin-bottom: 0;
                color: $grey_1;
            }
            @include media(s2) {
                padding: $h4;
                border: 1px dashed black;
            }
        }
    }
</style>