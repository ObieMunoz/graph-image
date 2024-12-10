import type {
	ResizeFunction,
	TransformFunction,
	Fit,
	VerticalPosition,
	Watermark,
	TransformParams
} from './types.js';

const deviceSizes = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const relativeSizes = [1, 2];

function bgColor(backgroundColor: string | boolean): string {
	return typeof backgroundColor === 'boolean' ? 'lightgray' : backgroundColor;
}

function resizeImage(width: number, fit: Fit = 'clip', height?: number): string {
	return `resize=w:${width},${height ? `h:${height},` : ''}fit:${
		fit == 'center-contain' ? 'clip' : fit
	}`;
}

function compressAndWebp(webp: boolean): string {
	return `${webp ? 'auto_image/' : ''}compress`;
}

function constructURL(handle: string, withWebp: boolean, baseURI: string): ResizeFunction {
	return function (resize: string): TransformFunction {
		return function (transforms: string[]): string {
			return [baseURI, resize, ...transforms, compressAndWebp(withWebp), handle].join('/');
		};
	};
}

function getWidths(sizes: string): number[] {
	const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
	const percentSizes = [];
	for (let match; (match = viewportWidthRe.exec(sizes)); match) {
		percentSizes.push(parseInt(match[2]));
	}

	if (percentSizes.length) {
		const smallestRatio = Math.min(...percentSizes) * 0.01;
		return deviceSizes.filter((s) => s <= deviceSizes[deviceSizes.length - 1] * smallestRatio);
	}

	return deviceSizes;
}

function srcSet(
	srcBase: (resize: string) => (transforms: string[]) => string,
	sizes: string | undefined | null,
	width: number,
	fit: string,
	transforms: string[]
): string {
	if (!sizes) {
		return relativeSizes
			.map((size) => {
				const resizeOption = `resize=w:${width * size},fit:${fit}`;
				const src = srcBase(resizeOption)(transforms);
				return `${src} ${size}x`;
			})
			.join(',\n');
	}

	const widths = getWidths(sizes);

	return widths
		.map((width) => {
			const resizeOption = `resize=w:${width},fit:${fit}`;
			const src = srcBase(resizeOption)(transforms);
			return `${src} ${width}w`;
		})
		.join(',\n');
}

function createFinalURL(
	handle: string,
	width: number,
	fit: Fit,
	sizes: string | undefined | null = undefined,
	withWebp: boolean,
	baseURI: string,
	transformations: TransformParams = {}
) {
	//Get Image Transforms
	const transforms = createTransformations(transformations);
	//Get base Url
	const srcBase = constructURL(handle, withWebp, baseURI);
	const imageWidth = sizes ? deviceSizes[deviceSizes.length - 1] : width;
	const sizedSrc = srcBase(resizeImage(imageWidth, fit));

	const src = sizedSrc(transforms);
	const srcset = srcSet(srcBase, sizes, width, fit, transforms);

	return {
		src,
		srcset
	};
}

function createWatermarkTransformation(watermark: Watermark): string {
	const { handle, size, position } = watermark;

	const defaultVertical = 'middle';
	const verticalPositions: { [key in VerticalPosition]: true } = {
		top: true,
		middle: true,
		bottom: true
	};

	let positionStr: string;
	if (Array.isArray(position)) {
		positionStr = `${position[0]},${position[1]}`;
	} else if (verticalPositions[position as VerticalPosition]) {
		positionStr = position;
	} else {
		positionStr = `${defaultVertical},${position}`;
	}

	const sizeStr = size !== undefined ? `,size:${size}` : '';
	return `watermark=position:[${positionStr}],file:${handle}${sizeStr}`;
}

function createTransformations({ quality, sharpen, rotate, blur, watermark }: TransformParams) {
	const transforms = [];

	if (quality && quality > 0 && quality <= 100) {
		transforms.push(`quality=value:${quality}`);
	}

	if (sharpen && sharpen <= 20) {
		transforms.push(`sharpen=amount:${sharpen}`);
	}

	if (blur && blur > 0 && blur <= 100) {
		transforms.push(`blur=amount:${blur}`);
	}

	if (rotate && rotate > 0 && rotate < 360) {
		transforms.push(`rotate=deg:${rotate}`);
	}
	if (watermark) {
		transforms.push(createWatermarkTransformation(watermark));
	}
	return transforms;
}

export { bgColor, createFinalURL };
