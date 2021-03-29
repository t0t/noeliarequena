<script>
    export let title = ""
    export let subtitle = ""
    export let text = ""
    export let img = ""
    let innerWidth, innerHeight, scrollY, alphascroll;

    // $: if ( scrollY < (innerHeight / 2) ) {
    //     topescroll = scrollY + 150
    // }
</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;

    .Cover {
        height: 50vh;
        padding: $h3;
        color: $white;
        background-size: cover;
        background-attachment: fixed;
        background-position: top center;
        position: relative;
        background-color: $grey_5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        background-repeat: no-repeat;
        
        @include media(s1) {
            height: 100vh;
            background-position: center;
            display: grid;
            align-items: end;
            grid-template-areas: 
            "title"
            "text";
            text-align: center;
        }
        
        .CoverTitle {
            @include media(s1) {
                grid-area: title;
                display: flex;
                flex-direction: column;
            }
        }
        .CoverSubTitle {
            margin-top: 0;
            text-shadow: none;
        }
        .CoverText {
            @include media(s1) {
                padding-top: $h2;
                grid-area: text;
                border-top: 1px dotted $grey_0;
            }
        }
    }
</style>

<svelte:window bind:innerWidth bind:innerHeight bind:scrollY />

<header class="Cover" style="
                    background-image: url({img});
                    opacity: {1 - Math.max(0, scrollY / (innerHeight/2))};">
    <h1 class="CoverTitle">
        {title} <br>
        <span>
            <h2 class="CoverSubTitle"> {subtitle} </h2>
        </span>
    </h1>
    <p class="CoverText">{text}</p>
</header>