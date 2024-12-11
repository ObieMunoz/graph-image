import type { HTMLImgAttributes } from 'svelte/elements';

export interface GraphAsset {
	handle: string;
	height: number;
	width: number;
}

export interface ImageCacheType {
	[handle: string]: boolean;
}

export interface ResizeParams {
	width: number;
	height: number;
	fit: string;
}

export type ResizeFunction = (resize: string) => TransformFunction;
export type TransformFunction = (transforms: string[]) => string;
export type VerticalPosition = 'top' | 'middle' | 'bottom';
export type HorizontalPosition = 'left' | 'center' | 'right';

export type Watermark = {
	handle: string;
	size?: number;
	position: VerticalPosition | HorizontalPosition | [VerticalPosition, HorizontalPosition];
};

export type Fit = 'clip' | 'crop' | 'scale' | 'max' | 'center-contain';
export type Load = 'lazy' | 'eager';
export type TransformParams = {
	quality?: number;
	sharpen?: number;
	rotate?: number;
	blur?: number;
	watermark?: Watermark;
};

export interface ImageProps extends Omit<HTMLImgAttributes, 'src' | 'srcset'> {
	handle: string;
	title?: string;
	width: number;
	height: number;
	baseURI?: string;
	media?: string | null;
	/** @description determines how the images is scaled
	 *  @default 'constrained'
	 */
	layout?: 'fullWidth' | 'constrained' | 'fixed';
	// --- Styling and Presentation ---
	fit?: Fit;
	maxHeight?: number;
	absolute?: boolean;
	// --- Transforms ---
	quality?: number;
	rotate?: number;
	sharpen?: number;
	blur?: number;
	withWebp?: boolean;
	watermark?: Watermark;
}

export interface GraphImageProps extends Omit<ImageProps, 'handle' | 'style' | 'width' | 'height'> {
	image: GraphAsset;
	// --- Styling and Presentation ---
	fit?: Fit;
	style?: Partial<CSSStyleDeclaration>;
	load?: Load;
	// --- Image Enhancements and Effects ---
	backgroundColor?: string | boolean;
	blurryPlaceholder?: boolean;
}
