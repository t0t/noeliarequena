<script>
    import { onMount, onDestroy } from 'svelte';
    import { data } from '../data/data.js';
    import { productos } from '../data/productos.js';

    import Layout from '../_Layout.svelte';
    import ProductGallery from '../components/particular/ProductGallery/ProductGallery.svelte';
    import Cover from '../components/generic/Cover.svelte';
    import SectionHalf from "../components/generic/SectionHalf.svelte";
    import Button from '../components/generic/Button.svelte';
    export let current_page_name = "artwork";

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
        title={data[12].title}
        subtitle={data[12].subtitle}
        text={data[12].text}
        img={data[12].img}
    />

    <SectionHalf variante={1} title={data[2].title} text={data[2].subtitle}>
        <span slot="hasvideo">
            <video poster="/img/cover3.jpg" loop playsinline controls="controls">
                <source
                    src="/img/desdelapoesiadelamateria.webm"
                    type="video/webm" />
                <source
                    src="/img/desdelapoesiadelamateria.mp4"
                    type="video/mp4" />
                <p>Ups! Su navegador no soporta vídeos HTML5.</p>
            </video>
        </span>
    </SectionHalf>

    <ProductGallery
        titulo={data[3].title}
        texto={data[3].subtitle}
        {productos}
    />

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

<slot />
