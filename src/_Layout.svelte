<script>
    import {fade} from 'svelte/transition'
    export let id;
</script>

<!-- <style lang="scss">
    @use "sass/_index.scss" as *;
</style> -->

<main {id} in:fade="{{duration: 500}}">
    <slot></slot>
</main>