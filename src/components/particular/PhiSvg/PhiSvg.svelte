<script>
    import Button from "../../generic/Button.svelte";
    import {
        tweened
    } from "svelte/motion";
    export let title = ""
    export let text = ""
    let angle = 0.618033988749;
    let numDots = 360;
    let dotsize = 1.62 * 1.62;
    let tweenedCount = tweened(0, {
        duration: 500,
        interpolate: (a, b) => (t) => Math.round(((b - a) * t) + a)
    })
    let innerWidth, innerHeight, svgWidth;
    export let variante = 0;
    let modificador = [
        "Light",
        "Dark",
        "Colored",
        "Light2"
    ];

    $: $tweenedCount = numDots
</script>

<style lang="scss">
    @use "../../../sass/_index.scss"as *;

    svg {
        circle {
            fill: $grey_2;
        }

        g {
            transform: translate(50%, 50%);
        }
    }

    .PhiSvg {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas: "media""texto";
        padding-top: 0;
        padding-right: $h3;
        padding-left: $h3;
        padding-bottom: $h2;

        @include media(s2) {
            padding-bottom: 0;
            padding-right: 0;
            grid-template-columns: 1fr 1.62fr;
            grid-template-areas: "texto media";
        }

        .BannerMedia {
            grid-area: media;
        }

        .controls {
            margin-top: $h2;
            margin-bottom: $h2;
            width: 100%;
            display: grid;
            gap: $h3;
        }

        .PhiSvgText {
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
        background-color: $grey_4;
    }

    .Light2 {
        background-color: $grey_0;
        color: $grey_5;

        p {
            color: $grey_5;
        }
    }
</style>

<svelte:window bind:innerWidth bind:innerHeight />

<section class="PhiSvg {modificador[variante]}">

    <div class="BannerMedia">

        <slot name="hasvideo">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <g>
                    {#each { length: $tweenedCount } as _, index(index)}
                        <circle r="{dotsize}" 
                        cx={Math.cos(index * angle * 2 * Math.PI) * index * 0.2} 
                        cy={Math.sin(index * angle * 2 * Math.PI) * index * 0.2} />
                    {/each}
                </g>
            </svg>
        </slot>
    </div>
    
    <div class="PhiSvgText">
        <h2>{title}</h2>
        <p>{@html text}</p>
        <div class="controls">
            <input type="number" bind:value={angle} step="0.001">
            <input type="range" bind:value={$tweenedCount} min={0} max={numDots}>
        </div>
        <Button variante={0} text="Play" on:click={() => {$tweenedCount = $tweenedCount > 0 ? 0 : numDots; }} />
    </div>

</section>