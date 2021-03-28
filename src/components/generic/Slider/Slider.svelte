<script>
    import { flip } from 'svelte/animate';
    // import { fade } from "svelte/transition";
    import Button from '../Button.svelte';

    export let slides;
    let speed = 500;
    let ancho_slides;

    const rotateLeft = () => {
        // const elemento_movido = slides[slides.length - 1]; // coge ultimo elemento
        // document.getElementById(elemento_movido.id).style.opacity = "0";
        slides = [
            slides[slides.length - 1],
            ...slides.slice(0, slides.length - 1),
        ];
        // setTimeout( () => {
        //     document.getElementById(elemento_movido.id).style.opacity = "1"
        // }, speed);
    };

    // const rotateRight = () => {
    //     const elemento_movido = slides[0]; // coge primer elemento de la lista
    //     console.log(elemento_movido);
    //     document.getElementById(elemento_movido.id).style.backgroundImage = "none";
    //     slides = [...slides.slice(1, slides.length), elemento_movido];
    //     setTimeout( () => {
    //         document.getElementById(elemento_movido.id).style.backgroundImage = "inherit"
    //     }, speed);
    // }
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
        <!-- <Button variante={0} text="Right" 
        on:click={rotateRight} /> -->
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
        height: 600px;
        position: relative;
        display: grid;
        place-content: center;
        background-size: cover;
        background-position: center;
        mask: linear-gradient(to right,transparent, black 40%,black 70%,transparent);
        -webkit-mask: linear-gradient(to right,transparent, black 40%,black 70%,transparent);

        .Caption {
            color: $grey_0;
            user-select: none;
            padding-left: $h4;
            padding-right: $h4;
            @include media(s0) {
                text-align: center;
            }
            @include media(s1) {
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
