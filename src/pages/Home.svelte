<script>
  import { data } from "../data/data.js";
  import { slides } from "../data/slider.js";

  import Cover from "../components/generic/Cover.svelte";
  import Slider from "../components/generic/Slider/Slider.svelte";
  import Layout from '../_Layout.svelte';
  import NavSecondary from "../components/generic/navsecondary/NavSecondary.svelte";
  import BannerTexto from "../components/generic/BannerTexto.svelte";
  import Button from "../components/generic/Button.svelte";
  export let current_page_name = "home";
</script>

<svelte:head>
  <title>Sergio Forés - {current_page_name}</title>
</svelte:head>

<Layout id={current_page_name}>

  <Cover title={data[0].title} subtitle={data[0].subtitle} text={data[0].text} img={data[0].img} />

  <NavSecondary />

  <Slider {slides} />

</Layout>