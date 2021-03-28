<script>
    export let quote;
    export let author;
    export let variante = 0;
    export let modificador = [
        "Default",
        "Grey",
        "Invert",
        "Basic"
    ];
</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;
    
    .Grey {
        color: $primary;
    }
    .Invert {
        color: $secondary;
        /* font-weight: inherit; */
    }
    blockquote {
      @include margin-bottom(1);
    }
</style>

<blockquote class="Quote {modificador[variante]}">
    <i>"{quote}"</i>
    <small> — {author}</small>
</blockquote>
