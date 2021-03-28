<script>
    import {fade} from 'svelte/transition';
    export let x = 0
    export let y = 0
    let moving = false

    const start = () => {
        moving = true
    }
    function stop() {
        moving = false
    }

    function move(e) {
        if (moving) {
            x += e.movementX * 2.5
            y += e.movementY * 2.5
        }
    }
</script>

<style lang="scss">
    @use "../../../sass/_index.scss" as *;

    .draggable {
        user-select: none;
        cursor: move;
        z-index: 1000;
        @include type-setting(3);
    }
</style>

<svelte:window on:mouseup={stop} />
<text x={x} y={y} 
    on:mousedown={start}
    on:mousemove={move}
    class="draggable"
>
{#if moving}
    <div transition:fade>xxx</div>
{/if}
<slot></slot>
</text>