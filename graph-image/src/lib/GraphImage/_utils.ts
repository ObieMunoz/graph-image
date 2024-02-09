import { writable, get } from 'svelte/store';
import type {
	GraphAsset,
	ImageCacheType,
	ResizeParams,
	ResizeFunction,
	TransformFunction,
	Watermark,
	VerticalPosition,
	Fit
} from './types.js';

const imageCache = writable<ImageCacheType>({});
const listeners: [Element, () => void][] = [];
let io: IntersectionObserver | undefined;

function inImageCache(image: GraphAsset, shouldCache: boolean): boolean {
	const cache = get(imageCache);

	if (cache[image.handle]) {
		return true;
	}

	if (shouldCache) {
		imageCache.update((current) => {
			current[image.handle] = true;
			return current;
		});
	}

	return false;
}

function getIO(): IntersectionObserver {
	if (!io && typeof window !== 'undefined') {
		io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					listeners.forEach((listener) => {
						if (listener[0] === entry.target) {
							// Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
							if (entry.isIntersecting || entry.intersectionRatio > 0) {
								// when we intersect we cache the intersecting image for subsequent mounts
								io!.unobserve(listener[0]);
								listener[1]();
							}
						}
					});
				});
			},
			{ rootMargin: '200px' }
		);
	}

	if (!io) {
		throw new Error('IntersectionObserver is not available');
	}

	return io;
}

function listenToIntersections(element: Element, callback: () => void): void {
	getIO().observe(element);
	listeners.push([element, callback]);
}

function bgColor(backgroundColor: string | boolean): string {
	return typeof backgroundColor === 'boolean' ? 'lightgray' : backgroundColor;
}

function resizeImage({ width, height, fit }: ResizeParams): string {
	return `resize=w:${width},h:${height},fit:${fit == 'center-contain' ? 'clip' : fit}`;
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

function responsiveSizes(size: number): number[] {
	return [size / 4, size / 2, size, size * 1.5, size * 2, size * 3];
}

function getWidths(width: number, maxWidth: number): number[] {
	const sizes = responsiveSizes(maxWidth).filter((size) => size < width);
	// Add the original width to ensure the largest image possible is available for small images.
	const finalSizes = [...sizes, width];
	return finalSizes;
}

function srcSet(
	srcBase: (resize: string) => (transforms: string[]) => string,
	srcWidths: number[],
	height: number,
	fit: string,
	transforms: string[]
): string {
	return srcWidths
		.map((width) => {
			const resizeOption = `resize=w:${Math.floor(width)},h:${Math.floor(height)},fit:${
				fit == 'center-contain' ? 'clip' : fit
			}`;
			const src = srcBase(resizeOption)(transforms);
			return `${src} ${Math.floor(width)}w`;
		})
		.join(',\n');
}

export function imgSizes(maxWidth: number): string {
	return `(min-width: ${maxWidth}px) ${maxWidth}px, 100vw`;
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

function createFinalURL(
	image: GraphAsset,
	withWebp: boolean,
	baseURI: string,
	maxWidth: number,
	fit: Fit,
	quality: number | undefined = undefined,
	sharpen: number | undefined = undefined,
	rotate: number | undefined = undefined,
	blur: number | undefined = undefined,
	watermark: Watermark | undefined = undefined
) {
	const transforms = createTransformations(quality, sharpen, rotate, blur, watermark);
	const srcBase = constructURL(image.handle, withWebp, baseURI);

	const sizedSrc = srcBase(resizeImage({ width: image.width, height: image.height, fit }));
	const src = sizedSrc(transforms);

	const srcset = srcSet(srcBase, getWidths(image.width, maxWidth), image.height, fit, transforms);
	const sizes = imgSizes(maxWidth);
	return {
		src,
		srcset,
		sizes
	};
}

function createTransformations(
	quality: number | undefined,
	sharpen: number | undefined,
	rotate: number | undefined,
	blur: number | undefined,
	watermark: Watermark | undefined
) {
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

export { bgColor, createFinalURL, inImageCache, listenToIntersections };
