<script>
    import viewport from './useViewportAction';

    export let title;
    export let description;
    export let imagen;
    export let referencia;
    export let id;

    let active = false;
    let opacity_effect; //efecto de use function on enter viewport
    let transform_effect; //efecto de use function on enter viewport
    const showDescription = (e) => {
        active = !active
        console.log(e.target)
    }
</script>

<article
    use:viewport
    on:enterViewport={() => { opacity_effect = 1; transform_effect = 0; }}
    on:exitViewport={() => { opacity_effect = 0; transform_effect = -10; }}
    style="
        opacity:{opacity_effect}; 
        transition: all 0.3s ease-out; 
        transform: translateX({transform_effect}rem)">
    
    <figure on:click={showDescription}>
        <img src="../{imagen}" alt={title} class="Obra" {id} />
        <h2>{active ? '-' : '+'}</h2>
        {#if active}
            <figcaption>
                <h3>{title}</h3>
                <p>{description} <br /><span>Ref: {referencia}</span></p>
            </figcaption>
        {/if}
    </figure>

</article>

<style lang="scss">
    @use "../../../sass/_index.scss"as *;

    .Obra {
        border-radius: 50%;

        &:hover {
            cursor: help;
        }
    }

    img {
        width: 100%;
    }

    figure {
        display: grid;
        justify-items: center;
        position: relative;
        /* margin: $h3 $h2; */
    }

    figcaption {
        z-index: 100;
        display: grid;
        place-content: center;
        padding: $h3;
        transition: 0.2s;
        width: 100%;
        height: 100%;
        text-align: center;
        position: absolute;
        top: 0;
        color: $white;
        user-select: none;

        &:hover {
            cursor: pointer;
        }

        h3 {
            font-weight: bold;
        }

        p {
            font-style: italic;
            align-self: start;
            text-align: center;
        }
    }
</style>
