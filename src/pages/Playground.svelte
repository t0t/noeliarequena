<script>
    import { data } from '../data/data.js';
    import { onMount, onDestroy } from 'svelte';
    import Cover from '../components/generic/Cover.svelte';
    import ThreeBanner from '../components/particular/ThreeBanner/ThreeBanner.svelte';
    import PhiSvg from '../components/particular/PhiSvg/PhiSvg.svelte';
    import T0T from '../components/particular/T0T/T0T.svelte';
    import SectionHalf from "../components/generic/SectionHalf.svelte";
    import Button from '../components/generic/Button.svelte';
    import Layout from '../_Layout.svelte';

    let current_page_name = "playground"

    onMount(() => {
        console.log('MOUNTED COMPONENT');
    });

    onDestroy(() => {
        console.log('DESTROYED COMPONENT');
    });
</script>

<svelte:head>
    <title>Sergio Forés - {current_page_name}</title>
</svelte:head>

<Layout id={current_page_name}>
    <Cover
        title={data[11].title}
        subtitle={data[11].subtitle}
        text={data[11].text}
        img={data[11].img}
    />

    <SectionHalf variante={2} title={data[5].title} text={data[5].subtitle}>
        <nav>
            <a href="https://slides.com/sergiofores/" target="_blank">Slides</a>
            <a
                href="https://docs.google.com/document/d/15oUQRghNb_lihCFGJ9Ls0z1PyihD_a18v1V3AohVqQ4/edit?usp=sharing"
                target="_blank">Libro</a
            >
        </nav>
        <span slot="hasSVG"><T0T /></span>
    </SectionHalf>
    <ThreeBanner variante={3} title={data[6].title} text={data[6].subtitle} />
    <SectionHalf
        variante={3}
        title={data[7].title}
        text={data[7].subtitle}
        img={data[7].img}
    >
        <Button variante={1} text={data[7].button} url={data[7].buttonurl} />
    </SectionHalf>
    <PhiSvg variante={2} title={data[8].title} text={data[8].subtitle} />
</Layout>