<script>
    import { onMount, onDestroy } from 'svelte';
    import { data } from '../data/data.js';
    // import { productos } from '../data/productos.js';

    import Layout from '../_Layout.svelte';
    import ProductGallery from '../components/particular/ProductGallery/ProductGallery.svelte';
    import Cover from '../components/generic/Cover.svelte';
    import SectionHalf from "../components/generic/SectionHalf.svelte";
    import Button from '../components/generic/Button.svelte';
    export let current_page_name = "artwork";
    let is_products_page = true
    onMount(() => {
        console.log('MOUNTED COMPONENT');
    });

    onDestroy(() => {
        console.log('DESTROYED COMPONENT');
    });
</script>

<svelte:head>
    <title>Noelia Requena - {current_page_name}</title>
</svelte:head>

<Layout id={current_page_name}>
    
    <Cover {is_products_page}
        title={data[12].title}
        subtitle={data[12].subtitle}
        text={data[12].text}
        img={data[12].img}
    />

    <div id="content">
        <ProductGallery
        titulo={data[3].title}
        author_review={data[3].author_review}
        />
    </div>

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
