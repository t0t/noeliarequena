<script>
    import {
        data
    } from "../data/data.js";
    // import Cover from "../components/generic/Cover.svelte";
    import BannerTexto from "../components/generic/BannerTexto.svelte";
    import Button from "../components/generic/Button.svelte";
    import SectionHalf from "../components/generic/SectionHalf.svelte";
    import Layout from '../_Layout.svelte';

    export let current_page_name = "about"
</script>

<svelte:head>
    <title>Noelia Requena - {current_page_name}</title>
</svelte:head>

<Layout id={current_page_name}>

    <!-- <Cover title={data[13].title} subtitle={data[13].subtitle} text={data[13].text} img={data[13].img} /> -->

    <BannerTexto header={data[10].title} texto={data[10].subtitle} img={data[10].img} />

    <SectionHalf
        variante={1}
        title={data[4].title}
        text={data[4].subtitle}
        img={data[4].img}
    >
        <Button
            variante={0}
            text={data[4].buttontext}
            url={data[4].buttonurl}
        />
    </SectionHalf>

</Layout>