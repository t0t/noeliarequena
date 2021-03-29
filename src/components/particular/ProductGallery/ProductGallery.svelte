<script>
  import { productos } from "../../../data/productos.js";
  import { crossfade, fade } from "svelte/transition";

  export let titulo = "";
  export let author_review = "";

  let selected = "";
  let gallery;
  const [send, receive] = crossfade({
    duration: () => 350,
    fallback: fade,
  });

  $: currentIdx = selected
    ? productos.findIndex((d) => d.imagen === selected)
    : -1;
</script>

<div
  class="image-viewer"
  on:click={(e) => {
    if (e.target === e.currentTarget) {
      selected = "";
    }
  }}
>
  <nav>
    <button
      on:click={() => {
        const nextIdx = (currentIdx - 1) % productos.length;
        selected = productos[nextIdx].imagen;
      }}
    >
      prev
    </button>
    <button
      on:click={() => {
        const nextIdx = (currentIdx + 1) % productos.length;
        selected = productos[nextIdx].imagen;
      }}
    >
      next
    </button>
  </nav>

  {#if selected}
    <img
      in:receive={{ key: selected }}
      out:send={{ key: selected }}
      src={selected}
      alt="Imagen"
    />
  {/if}

  <div role="group" bind:this={gallery} class="gallery" tabindex={0}>
    {#each productos as d (d.title)}
      <div
        role="img"
        aria-label={d.title}
        data-selected={selected === d.imagen}
        class:active={selected === d.imagen}
        on:click={() => (selected = d.imagen)}
        class="image"
        style="background-image:url({d.imagen})"
      />
    {/each}
  </div>
</div>

<section class="LayoutObras">
  <h2>{titulo}</h2>
  <p>
    "Un cuerpo en el espacio. Un temblor en el tiempo. Un proceso de luz y
    sombra. El cuerpo se desvela deconstruyéndose, desmoronándose. La
    cristalización espontánea de una dinámica de contrastes. Claroscuro de
    fragilidad y fortaleza, de frío y calor. El cuerpo es un templo de
    tensiones. Un templo hermético, abierto y cerrado al mismo tiempo. Tan sólo
    puede existir en una lógica de membranas. Atravesado por la luz, reflejado
    como la sombra nerviosa de algo más. La orfebrería del óleo lo captura como
    a un insecto la resina. Congelado pero todavía palpitando. Anhelo cifrado
    como un enigma de muchas dimensiones. El trazo, grácil y preciso (caligrafía
    de misterios), deshilvana el misterio inagotable de la belleza. Hilo de
    Ariadna enredado. Oficio de tinieblas. Belleza del horror y horror de la
    belleza. Necesitamos el contraste. El equilibrio en la contradicción.
    Siempre el claroscuro...
    <br />
    Como en la técnica japonesa kintsugi, el barniz de la pintura repara las fracturas
    de la cerámica rota que es el cuerpo. Hay una belleza en la fractura, como un
    signo latente de su vida interior: vórtice de una herida que se despliega en
    el exterior. La tela recubre la forma como a una gasa el molde. La piel como impasto.
    La vida como un continuo instante de incertidumbre. ¿Somos libres o estamos encerrados,
    confinados en las coordenadas del azar? Este es el misterio de un cuerpo en una habitación,
    de un cuerpo habitando el espacio, de un cuerpo siendo espacio. La existencia
    se desnuda como una pregunta en el vacío, derramándose sobre el aire de la mañana, reflejándose en
    la luz que entra por la ventana. Y en este marco, en este espacio, celebramos
    el misterio de la vida."
    <br />
    <i>-- {author_review}</i>
  </p>
</section>

<style lang="scss">
  @use "../../../sass/_index.scss" as *;
  .LayoutObras {
    padding: $h4;
  }
  .image-viewer {
    position: relative;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $h1;
    padding-top: 0;
    padding-right: $h4;
    padding-bottom: 0;
    padding-left: $h4;
    width: 100%;
    img {
      max-width: $h8;
    }
  }
  .image {
    width: 50%;
    height: 70px;
    background: center / cover no-repeat;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, 100px );
    gap: $h1;
    border: 1px solid white;
    width: 100%;
    height: 50vh;
    overflow-y: auto;
    padding: $h1;
  }

  .gallery > .image {
    width: 100px;
    height: 100px;
  }

  nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .active {
    border: $h0 solid $highlight;
  }
</style>
