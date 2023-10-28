export interface ImageProps {
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