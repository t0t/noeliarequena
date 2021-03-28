<script>
  import Draggable from "./Draggable.svelte";
  import Button from "../../generic/Button.svelte";
  import {fade} from 'svelte/transition';

  let x = 0
  let y = 0;
  let new_items = [];
  let value = "";
  let base_unit = 1000
  let canvas = { width: base_unit, height: base_unit }
  let radio_peque = canvas.width/4;
  let radio_grande = canvas.width/2;
  let circles = [
    { id: "circulogrande", cx: radio_grande, cy: radio_grande, r: radio_grande },
    { id: "circuloizda", cx: radio_peque, cy: radio_grande, r: radio_peque },
    { id: "circulodcha", cx: radio_peque*3, cy: radio_grande, r: radio_peque }
  ]
  let items = [
    { id: 0, xpos: 0, ypos: 500 },
    { id: 1, xpos: 500, ypos: 500 },
    { id: 2, xpos: 750, ypos: 750 },
    { id: 3, xpos: 750, ypos: 250 },
    { id: 4, xpos: 1000, ypos: 500 }
  ]
  const addItem = () => {
    // Anade al array el texto del input 
    new_items = [...new_items, value]
  }
</script>

<style lang="scss">
    @use "../../../sass/_index.scss" as *;

    text {
        fill: $black;
        font-family: $secondary_font;
        font-weight: bold;
    }
    circle {
        fill: none;
        stroke: $grey_0;
        stroke-width: 4;
    }
    .controls {
        padding: 4px;
    }
    svg {}
</style>

<svg viewBox="-1 -1 {canvas.width} {canvas.height}" transform="">
  <g transform="translate(150,150) scale(0.7)">
    {#each circles as circle}
    <circle cx={circle.cx} cy={circle.cy} r={circle.r} id={circle.id} />
    {/each}
    <!-- matrix( scaleX(), skewY(), skewX(), scaleY(), translateX(), translateY() ) -->
    {#each items as item}
      <Draggable x={item.xpos} y={item.ypos}>{item.id}</Draggable>
    {/each}
  
    {#each new_items as new_i}
      <Draggable {x} {y}>{new_i}</Draggable>
    {/each}
  </g>
  </svg>

<div class="controls" transition:fade>
  <form on:submit|preventDefault={addItem}>
    <input bind:value placeholder="infinitud, espíritu, alma, mente, cuerpo">
    <Button variante={1} text="Añade item al mapa" />
  </form>
</div>
<slot></slot>