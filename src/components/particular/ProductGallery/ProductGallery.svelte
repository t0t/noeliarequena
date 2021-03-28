<script>
    import ProductItem from "./ProductItem.svelte"
    export let productos = [];
    export let titulo = "";
    export let texto = "";
    export let author_review = "";
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
        color: $highlight_1;
        background-color: $grey_4;
        
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
    <p>
        "Un cuerpo en el espacio. Un temblor en el tiempo. Un proceso de luz y sombra. El cuerpo se desvela deconstruyéndose, desmoronándose. La cristalización espontánea de una dinámica de contrastes. Claroscuro de fragilidad y fortaleza, de frío y calor. El cuerpo es un templo de tensiones. Un templo hermético, abierto y cerrado al mismo tiempo. Tan sólo puede existir en una lógica de membranas. Atravesado por la luz, reflejado como la sombra nerviosa de algo más. La orfebrería del óleo lo captura como a un insecto la resina. Congelado pero todavía palpitando. Anhelo cifrado como un enigma de muchas dimensiones. El trazo, grácil y preciso (caligrafía de misterios), deshilvana el misterio inagotable de la belleza. Hilo de Ariadna enredado. Oficio de tinieblas. Belleza del horror y horror de la belleza. Necesitamos el contraste. El equilibrio en la contradicción. Siempre el claroscuro...<br>

        Como en la técnica japonesa kintsugi, el barniz de la pintura repara las fracturas de la cerámica rota que es el cuerpo. Hay una belleza en la fractura, como un signo latente de su vida interior: vórtice de una herida que se despliega en el exterior. La tela recubre la forma como a una gasa el molde. La piel como impasto. La vida como un continuo instante de incertidumbre. ¿Somos libres o estamos encerrados, confinados en las coordenadas del azar? Este es el misterio de un cuerpo en una habitación, de un cuerpo habitando el espacio, de un cuerpo siendo espacio. La existencia se desnuda como una pregunta en el vacío, derramándose sobre el aire de la mañana, reflejándose en la luz que entra por la ventana. Y en este marco, en este espacio, celebramos el misterio de la vida."<br>
        <i>-- {author_review}</i>
    </p>
    <!-- <p>{@html texto}</p> -->

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