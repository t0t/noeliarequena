// Import the wrap method
import Home from './pages/Home.svelte';
import About from './pages/About.svelte';
import Artwork from './pages/Artwork.svelte';
import PageNotExist from './pages/PageNotExists.svelte';

const routes = {
	'/': Home,
	'/about': About,
	'/artwork': Artwork,
	// '/artwork/:id': Artwork,
	'*': PageNotExist
}

export default routes