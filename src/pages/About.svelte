<script>
    import {
        data
    } from "../data/data.js";
    import Cover from "../components/generic/Cover.svelte";
    import BannerTexto from "../components/generic/BannerTexto.svelte";
    import Button from "../components/generic/Button.svelte";
    import SectionHalf from "../components/generic/SectionHalf.svelte";
    import Layout from '../_Layout.svelte';


    export let current_page_name = "about"
</script>

<svelte:head>
    <title>Sergio Forés - {current_page_name}</title>
</svelte:head>

<Layout id={current_page_name}>

    <Cover title={data[13].title} subtitle={data[13].subtitle} text={data[13].text} img={data[13].img} />

    <BannerTexto header={data[10].title} texto={data[10].subtitle} img={data[10].img} />

    <SectionHalf title={data[9].title} text={data[9].subtitle}>
        <Button variante={1} text={data[9].buttontext} url={data[9].buttonurl} />
        <div slot="hasvideo">
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/7BtDRQuPjDg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
        </div>
    </SectionHalf>

</Layout>