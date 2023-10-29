import type { PageServerLoad } from './$types';
import { HYGRAPH_TOKEN, HYGRAPH_URL } from '$env/static/private';
import type { ImageProps } from '$lib/GraphImage/types';

export const load: PageServerLoad = async () => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${HYGRAPH_TOKEN}`);

	const graphql = JSON.stringify({
		query: `query PageTextContentQuery {
			  values: pageTextContent(where: {id: "clob2q6ws5fze0bk8z6g7mt22"}
			    	stage: PUBLISHED) {
				features
			    headline
			}
			  graphImages(where: {id: "clob1jc0y5fs70blfzvdbxv0z"}) {
				id
			    images(first: 100) {
				      handle
				      height
				      width
			    }
		  }
			  logo(where: {id: "clob3dnas5h2v0bl91wi2vc9q"}) {
				    logo {
				      handle
				      height
				      width
			    }
			  }
			}`
	});

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: graphql
	};

	let galleryImages: ImageProps[] = [];
	let headline = 'Advanced Lazy-Loading and Compression with Svelte/SvelteKit and Hygraph';
	let features = [
		'Automatically resize images according to your design specifications',
		'Dynamically serve .webp format where supported, ensuring modern compression techniques are utilized for faster load times',
		'Generate device-specific variants to ensure optimal download size',
		'Prioritize initial page speed and conserve bandwidth',
		"Employ the 'blur-up' technique or a solid background for seamless image loading experiences",
		'Prevent page layout jumps with consistent image positioning'
	];
	let logo: ImageProps = {
		handle: 'fONBVATVKYm2eBRtzA76',
		height: 510,
		width: 1603
	};

	try {
		const request = await fetch(HYGRAPH_URL, requestOptions);

		const data = await request.json();

		if (data.data.graphImages[0].images) {
			galleryImages = shuffleArray(data.data.graphImages[0].images) || [];
		}

		if (data.data.values.headline) {
			headline = data.data.values.headline;
		}

		if (data.data.values.features) {
			features = data.data.values.features;
		}
		if (data.data.logo.logo) {
			logo = data.data.logo.logo;
		}
	} catch (e) {
		console.log(e);
	}

	return {
		galleryImages,
		headline,
		features,
		logo
	};
};

function shuffleArray(array: ImageProps[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
