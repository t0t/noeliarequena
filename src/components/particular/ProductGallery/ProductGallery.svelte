<script>
    import ProductItem from "./ProductItem.svelte"
    export let productos = [];
    export let titulo = "";
    export let texto = "";
</script>

<style lang="scss">
    @use "../../../sass/_index.scss" as *;

    .LayoutObras {
        display: grid;
        grid-template-columns: 1fr;
        justify-items: center;
        gap: $h2;
        width: 100%;
        padding: $h3;
        color: $grey_5;
        background-color: $grey_2;
        
        p {
            @include margin-bottom(0);
        }
    }
    
    /* img {
        object-fit: cover;
        max-width: 100%;
        z-index: 100;
    } */
    .ObrasContainer {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax($h7, 1fr));

        @include media(s3) {
            justify-items: center;
            gap: 1px;
        }
    
        /* figure {
        display: grid;
        justify-items: center;
        position: relative;
        } */
    }
</style>

<section class="LayoutObras">
    
    <h2>{titulo}</h2>
    <p>{@html texto}</p>

    <div class="ObrasContainer">
    {#each productos as producto, i}
        <ProductItem 
            title= {producto.title}
            description= {producto.description}
            imagen= {producto.imagen}
            referencia= {producto.referencia}
            id={i}
            />
    {/each}
    </div>
  </section>