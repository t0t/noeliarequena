<script>
    import { onMount, onDestroy } from "svelte";
    export let title = "";
    export let text = "";
    import { createScene } from "./scene";
    let el;
    let three;
    onMount( () => {
        three = true
        if (three) {
            createScene(el)
        }
    });
    onDestroy( () => {
        el = null
        // console.log(`destroyed Three component ${el}`)
    });
    export let variante = 0;
    let modificador = [
        "Light",
        "Dark",
        "Colored",
        "Light2"
    ];
</script>

<style lang="scss">
    @use "../../../sass/_index.scss" as *;

    .ThreeBanner {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas: "video" "texto";
        padding-top: 0;
        padding-right: $h3;
        padding-left: $h3;
        padding-bottom: $h2;
        img {
            width: 100%;
        }
        
        @include media(s1) {
        }
        @include media(s2) {
            padding-bottom: 0;
            padding-right: 0;
            grid-template-columns: 1fr 1.62fr;
            grid-template-areas: "texto video";
        }

        .BannerMedia {
            grid-area: video;
            background-color: $black;
        }

        .ThreeBannerText {
            display: grid;
            justify-items: start;
            align-self: center;
            justify-self: center;
            grid-area: texto;

            @include media(s2) {
                margin-bottom: 0;
                margin-right: $h2;
                max-width: $bp1;
            }
            h2 {
                font-weight: bold;
                margin-top: $h0;
                margin-right: 0;
                margin-bottom: $h0;
                margin-left: 0;
                @include media(s1) {
                    font-weight: inherit;
                }
            }
        }
    }
    .Light {
        background-color: $grey_1;
        color: $grey_3;
        p {
            color: $grey_3;
        }
    }
    .Dark {
        background-color: $grey_3;
    }
    .Colored {
        background-color: $grey_5;
    }
    .Light2 {
        background-color: $grey_0;
        color: $grey_5;
        p {
            color: $grey_5;
        }
    }
    .webgl {
        max-width: 100%;
        /* min-height: 300px; */
    }
</style>

<section class="ThreeBanner {modificador[variante]}">
    
    <div class="BannerMedia">        
        <canvas bind:this={el} class="webgl" />
    </div>
    
    <div class="ThreeBannerText">
        <h2>{title}</h2>
        <p>{@html text}</p>
        <slot></slot>
    </div>

</section>