import type { GraphAsset, ResizeParams, ResizeFunction, Watermark, Fit } from './types.js';
export declare const createLoadObserver: (handler: () => void) => (el: Element) => void;
export declare function inImageCache(image: GraphAsset, shouldCache: boolean): boolean;
export declare function getIO(): IntersectionObserver;
export declare function listenToIntersections(element: Element, callback: () => void): void;
export declare function bgColor(backgroundColor: string | boolean): string;
export declare function resizeImage({ width, height, fit }: ResizeParams): string;
export declare function compressAndWebp(webp: boolean): string;
export declare function constructURL(handle: string, withWebp: boolean, baseURI: string): ResizeFunction;
export declare function responsiveSizes(size: number): number[];
export declare function getWidths(width: number, maxWidth: number): number[];
export declare function srcSet(srcBase: (resize: string) => (transforms: string[]) => string, srcWidths: number[], height: number, fit: string, transforms: string[]): string;
export declare function imgSizes(maxWidth: number): string;
export declare function createWatermarkTransformation(watermark: Watermark): string;
export declare function createFinalURL(image: GraphAsset, withWebp: boolean, baseURI: string, maxWidth: number, fit: Fit, quality: number | undefined, sharpen: number | undefined, rotate: number | undefined, watermark: Watermark | undefined): {
    finalSrc: string;
    thumbSrc: string;
    srcSetImgs: string;
    sizes: string;
};
//# sourceMappingURL=_utils.d.ts.map