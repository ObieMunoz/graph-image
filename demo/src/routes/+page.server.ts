import type { PageServerLoad } from './$types';
import { HYGRAPH_TOKEN, HYGRAPH_URL } from '$env/static/private';
import type { GraphImageTypes } from 'graph-image';
import { GraphQLClient, gql } from 'graphql-request';
import { parse } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export const load: PageServerLoad = async ({ fetch }) => {
	const client = new GraphQLClient(HYGRAPH_URL, {
		headers: {
			Authorization: `Bearer ${HYGRAPH_TOKEN}`
		},
		fetch
	});

	const query: TypedDocumentNode<
		{
			pageTextContent: { features: Array<string>; headline: string };
			graphImages: Array<{ id: string; images: Array<GraphImageTypes.GraphAsset> }>;
			logo: { logo: GraphImageTypes.GraphAsset };
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Record<any, never>
	> = parse(gql`
		query PageTextContentQuery {
			pageTextContent: pageTextContent(
				where: { id: "clob2q6ws5fze0bk8z6g7mt22" }
				stage: PUBLISHED
			) {
				features
				headline
			}
			graphImages(where: { id: "clob1jc0y5fs70blfzvdbxv0z" }) {
				id
				images(first: 100) {
					handle
					height
					width
				}
			}
			logo(where: { id: "clob3dnas5h2v0bl91wi2vc9q" }) {
				logo {
					handle
					height
					width
				}
			}
		}
	`);

	let galleryImages: GraphImageTypes.GraphAsset[] = [];
	let headline = 'Advanced Lazy-Loading and Compression with Svelte/SvelteKit and Hygraph';
	let features = [
		'Automatically resize images according to your design specifications',
		'Dynamically serve .webp format where supported, ensuring modern compression techniques are utilized for faster load times',
		'Generate device-specific variants to ensure optimal download size',
		'Prioritize initial page speed and conserve bandwidth',
		"Employ the 'blur-up' technique or a solid background for seamless image loading experiences",
		'Prevent page layout jumps with consistent image positioning'
	];
	let logo: GraphImageTypes.GraphAsset = {
		handle: 'fONBVATVKYm2eBRtzA76',
		height: 400,
		width: 1200
	};

	try {
		const data = await client.request({ document: query });

		if (data.graphImages[0].images) {
			galleryImages = shuffleArray(data.graphImages[0].images) || [];
		}

		if (data.pageTextContent.headline) {
			headline = data.pageTextContent.headline;
		}

		if (data.pageTextContent.features) {
			features = data.pageTextContent.features;
		}
		if (data.logo.logo) {
			logo = data.logo.logo;
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

function shuffleArray(array: GraphImageTypes.GraphAsset[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
