<template>
  <div class="home">
    <HelloWorld msg="Noelia Requena" />
    <a href="https://www.instagram.com/noelia__requena/" target="_blank">
    More on Instagram
    </a>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  }
};
</script>
