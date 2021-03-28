<!-- <script>
    let promesa = getPost()
	
	async function getPost() {
		const response = await fetch("./data/blog.json",)
		if(response.status === 200) {
			const resultado = await response.json()
			// console.log(resultado.posts)
		return resultado.posts
        } else {
            throw new Error("Hubo un error en el request")
        }
    }
</script>

{#await promesa}
	<p>...Cargando promesa</p>
{:then value}
    {#each value as item}
        <p>{item.title}</p>
        <img src="{item.imagen}" alt="">
        <p>{item.excerpt}</p>
    {/each}
{:catch error}
	<p>error: {error.message}</p>
{/await} -->