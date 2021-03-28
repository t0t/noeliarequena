<script>
    export let header = ""
    export let texto = ""
    export let img = ""
</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;

    .BannerTexto {
        position: relative;
        background-color: $white;
        height: 100vh;
        display: grid;
        align-items: center;
        justify-items: center;
        text-align: center;
        padding: $h3;
        
        /* .BannerTextoHeader {
            z-index: 1;
        } */
        .BannerTextoText {
            color: $quaternary;
            /* @include media(s2) {
                @include type-setting(1);
            } */
        }
    }
    .Avatar {
        max-width: 200px;
        border-radius: 50%;
    }
</style>

<section class="BannerTexto">
    <img class="Avatar" src={img} alt="">
    <h2 class="BannerTextoHeader">
        {header} <br>
        <span class="BannerTextoText">{texto}</span>
    </h2>
</section>