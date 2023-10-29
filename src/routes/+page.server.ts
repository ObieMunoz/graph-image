import type { PageServerLoad } from './$types';
import { HYGRAPH_TOKEN, HYGRAPH_URL } from '$env/static/private';

export const load: PageServerLoad = async () => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${HYGRAPH_TOKEN}`);

	const graphql = JSON.stringify({
		query:
			'query GraphImageQuery($id: ID!) {\n  values: graphImage(where: {id: $id}) {\n    images(first: 500) {\n      handle\n      width\n      height\n    }\n  }\n}',
		variables: { id: 'clob1jc0y5fs70blfzvdbxv0z' }
	});

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: graphql
	};

	let galleryImages = [];
	try {
		const request = await fetch(HYGRAPH_URL, requestOptions);

		const data = await request.json();
		galleryImages = data.data.values.images;
	} catch (e) {
		console.log(e);
	}

	return {
		data: {
			galleryImages
		}
	};
};
