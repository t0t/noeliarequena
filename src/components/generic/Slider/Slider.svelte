<script>
    import { flip } from 'svelte/animate';
    import Button from '../Button.svelte';

    export let slides;
    let speed = 500;
    let ancho_slides;

    const rotateLeft = () => {
        slides = [
            slides[slides.length - 1],
            ...slides.slice(0, slides.length - 1),
        ];
    };
</script>

<svelte:window bind:innerWidth={ancho_slides} />

<main class="SliderContainer">
    <section class="SlidesGroup">
        {#each slides as slide (slide.id)}
            <article
                class="Slide"
                id={slide.id}
                style="
                    background-image: url({slide.href});
                    width: {ancho_slides}px;
                "
                animate:flip={{ duration: speed }}
            >
                <h2 class="Caption">
                    {@html slide.text}
                </h2>
            </article>
        {/each}
    </section>
    <nav class="SliderNav">
        <Button variante={4} text="➥" on:click={rotateLeft} />
    </nav>
</main>

<style lang="scss">
    @use "../../../sass/_index.scss" as *;

    .SliderContainer {
        position: relative;
        background-color: $grey_5;
        width: 100%;
        overflow-x: hidden;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }

    .SlidesGroup {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
    }

    .Slide {
        height: 450px;
        position: relative;
        display: grid;
        place-content: center;
        background-size: cover;
        background-position: center;
        
        @include media(s1) {
            height: $h7;
        }
        @include media(s2) {
            height: 600px;
            mask: linear-gradient(to top,transparent, black 40%,black 70%,transparent);
            -webkit-mask: linear-gradient(to top,transparent, black 40%,black 70%,transparent);
        }

        .Caption {
            color: $grey_0;
            user-select: none;
            padding-left: $h4;
            padding-right: $h4;
            text-align: center;
            font-style: italic;
            @include media(s0) {
                text-align: center;
            }
            @include media(s1) {
                width: 95vw;
                padding-left: $h1;
                padding-right: $h1;
            }
            @include media(s2) {
                max-width: 50vw;
                padding-left: $h2;
                padding-right: $h2;
            }
        }
    }

    .SliderNav {
        position: absolute;
        width: 100%;
        display: grid;
        bottom: 0;
        place-content: center;
        padding-top: 0;
        z-index: 1;
    }
</style>
