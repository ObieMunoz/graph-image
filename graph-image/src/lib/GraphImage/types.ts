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
