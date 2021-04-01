<script>
  import { crossfade, fade } from 'svelte/transition'
  import { productos } from '../../../data/productos.js'
  import Button from '../../generic/Button.svelte'

  export let titulo = ''
  export let author_review = ''
  let description = ''
  let selected = ''
  let gallery
  const [send, receive] = crossfade({
    duration: () => 2000,
    fallback: fade,
  })
  let idioma_switch = false
  let innerWidth, innerHeight;

  $: currentIdx = selected ? productos.findIndex((d) => d.imagen === selected) : -1
</script>

<style lang="scss">
  @use "../../../sass/_index.scss" as *;

  .LayoutObras {
    padding: $h2;
    @include media(s2) {
      padding: $h4;
    }
  }

  .image-viewer {
    position: relative;
    padding: 0;
    display: grid;
    grid-template-areas: 'figure gallery';
    
    @include media(s2) {
      margin-top: $h3;
      margin-right: $h3;
      margin-bottom: $h3;
      margin-left: $h3;
      justify-content: center;
    }

    img {
      max-width: 100%;
      @include media(s2) {
        max-height: 73vh;
      }
    }
  }

  .image {
    width: 50%;
    height: 70px;
    background: center / cover no-repeat;
    &:hover {
      cursor: pointer;
      border: 4px double $highlight;
    }
  }
  /* figure ~ .gallery {
    padding: 20px;
  } */
  figure {
    overflow-x: hidden;

    @include media(s1) {
      grid-area: figure;
      align-self: start;
    }
  }
  figcaption {
    max-width: 90%;
    margin-top: $h1;
    margin-left: $h1;
  }

  .gallery {
    display: grid;
    grid-area: gallery;
    width: 100vw;
    grid-template-columns: repeat(auto-fill, minmax(34px, 90px));
    gap: $h0;
    overflow-y: auto;
    overflow-x: hidden;
    outline: none;

    @include media(s2) {
      gap: $h1;
      padding-left: $h0;
    }
  }
  figure + .gallery {
    grid-template-columns: repeat(1, 73px);
    width: inherit;
    height: 50vh;

    @include media(s2) {
      width: 100%;
      height: 75vh;
      justify-content: center;
      grid-template-columns: repeat(3, 100px);
      margin-left: $h3;
    }
  }
  .gallery > .image {
    width: 100%;
    @include media(s1) {
      height: 100px;
    }
  }

  nav {
    display: flex;
    justify-content: space-between;
    width: $h5;
    padding-top: 0;
    top: -115px;
    right: $h2;
    color: white;
    
    @include media(s2) {
      position: absolute;
      align-items: flex-end;
      justify-self: center;
      padding-top: 0;
      bottom: -50px;
      left: auto;
      right: auto;
    }
  }
  .active {
    border: $h0 solid $highlight;
  }
  .idioma_switch {
    position: relative;
    margin-bottom: $h1;
    display: flex;
    justify-items: flex-end;
    button:nth-child(1) {
      position: absolute;
      right: 0;
      top: 0;
      border: none;
      background-color: transparent;
      color: $highlight;
      &:hover {
        color: $grey_2;
        cursor: pointer;
      }
    }
  }
</style>

<svelte:window bind:innerWidth bind:innerHeight />

<div
  class="image-viewer"
  on:click={(e) => {
    if (e.target === e.currentTarget) {
      selected = ''
    }
  }}>
  {#if selected}
    <nav>
      <Button
        variante={4}
        text="⤝"
        on:click={() => {
          const nextIdx = (currentIdx - 1) % productos.length
          selected = productos[nextIdx].imagen
          description = productos[nextIdx].description
        }} />
      <Button
        variante={4}
        text="⤞"
        on:click={() => {
          const nextIdx = (currentIdx + 1) % productos.length
          selected = productos[nextIdx].imagen
          description = productos[nextIdx].description
        }} />
    </nav>
    <figure>
      <img
        in:receive={{ key: selected }}
        out:send={{ key: selected }}
        src={selected}
        alt={productos[currentIdx].description} />
      <figcaption>
        REF: {productos[currentIdx].ref} {productos[currentIdx].description}
      </figcaption>
    </figure>
  {/if}

  <div role="group" bind:this={gallery} class="gallery">
    {#each productos as d (d.ref)}
      <div
        role="img"
        aria-label={d.ref}
        data-selected={selected === d.imagen}
        class:active={selected === d.imagen}
        on:click={() => (selected = d.imagen)}
        class="image"
        style="background-image:url({d.imagen})" />
    {/each}
  </div>
</div>

<section class="LayoutObras">
  <div class="idioma_switch">
    <button
      on:click={() => {
        idioma_switch = !idioma_switch
      }}>
      {#if idioma_switch}English{:else}Español{/if}
    </button>
  </div>

  <h2>{titulo}</h2>
  {#if idioma_switch}
    <p>
      "Un cuerpo en el espacio. Un temblor en el tiempo. Un proceso de luz y sombra. El cuerpo se desvela deconstruyéndose, desmoronándose. La cristalización espontánea de una dinámica de contrastes. Claroscuro de fragilidad y fortaleza, de frío y calor. El cuerpo es un templo de tensiones. Un templo hermético, abierto y cerrado al mismo tiempo. Tan sólo puede existir en una lógica de membranas. Atravesado por la luz, reflejado como la sombra nerviosa de algo más. La orfebrería del óleo lo captura como a un insecto la resina. Congelado pero todavía palpitando. Anhelo cifrado como un enigma de muchas dimensiones. El trazo, grácil y preciso (caligrafía de misterios), deshilvana el misterio inagotable de la belleza. Hilo de Ariadna enredado. Oficio de tinieblas. Belleza del horror y horror de la belleza. Necesitamos el contraste. El equilibrio en la contradicción. Siempre el claroscuro...
    </p>
    <p>
      Como en la técnica japonesa kintsugi, el barniz de la pintura repara las
      fracturas de la cerámica rota que es el cuerpo. Hay una belleza en la
      fractura, como un signo latente de su vida interior: vórtice de una herida
      que se despliega en el exterior. La tela recubre la forma como a una gasa
      el molde. La piel como impasto. La vida como un continuo instante de
      incertidumbre. ¿Somos libres o estamos encerrados, confinados en las coordenadas del azar? Este es el misterio de un cuerpo en una habitación, de un cuerpo habitando el espacio, de un cuerpo siendo espacio. La existencia se desnuda como una pregunta en el vacío, derramándose sobre el
      aire de la mañana, reflejándose en la luz que entra por la ventana. Y en
      este marco, en este espacio, celebramos el misterio de la vida."
    </p>
  {:else}
    <p>
      "A body in space. A tremor in time. A process of light and shade. Once revealed, the body disintegrates and is deconstructed. A spontaneous crystallisation of dynamic contrasts. A chiaroscuro of fragility and power, cold and heat. The body is a temple of tensions; hermetic, open and shut at the same time, existing only in the logic of membranes. Light that passes through, reflected like the nervous shade of something more. The ornament of the oils captures it like an insect in amber. Frozen but at the same time fluttering. An encrypted longing, like a puzzle in multiple dimensions. The precise and graceful line (a calligraphy of mysteries), unravelling the inexhaustible mystery of beauty. Ariadne’s thread entangling. A dark profession. The beauty of horror and the horror of beauty. We need the contrast. The balance in the contradiction. Always the light and the shade, the chiaroscuro...
    </p>
    <p>
      As in the Japanese technique, kintsugi, the lacquer repairs the cracks in the broken ceramic, which is the body. There is a beauty in the crack, like a latent sign of its interior life: vortex of a wound made manifest on the outside. Cloth covers the shape like a gauze a mould. Skin as impasto. Life as a continuous moment of uncertainty. Are we free or are we confined within the coordinates of chance? This is the mystery of a body in a room, a body inhabiting a space, of a body being space. Existence is naked like a question in the void, spilling over the morning air, reflected in the light coming through the window. In this frame, in this space we celebrate the mystery of life."
    </p>
  {/if}
  <p>—{author_review}</p>
</section>
