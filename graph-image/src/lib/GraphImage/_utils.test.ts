import { bgColor, createFinalURL } from './_utils.js';
import { imageCache } from './cache.svelte.js';
import { describe, it, expect } from 'vitest';
import type { GraphAsset, Watermark } from './types.js';

describe('_utils.ts // Utility Functions', () => {
	describe('bgColor', () => {
		it('should return lightgray when input is boolean', () => {
			expect(bgColor(true)).toBe('lightgray');
			expect(bgColor(false)).toBe('lightgray');
		});

		it('should return the input string when input is a string', () => {
			expect(bgColor('red')).toBe('red');
		});
	});

	describe('createFinalURL', () => {
		it('should correctly generate final URL without any transformations', () => {
			const result = createFinalURL(
				'sampleHandle',
				1920,
				'crop',
				'100vw',
				true,
				'http://example.com'
			);
			const expecteddeviceSizes = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
			const expectedSrcSet = expecteddeviceSizes
				.map((size) => {
					return `http://example.com/resize=w:${size},fit:crop/auto_image/compress/sampleHandle ${size}w`;
				})
				.join(',\n');

			expect(result.srcset).toBe(expectedSrcSet);
		});

		it('should apply quality transformation', () => {
			const result = createFinalURL('sampleHandle', 100, 'crop', undefined, true, 'test', {
				quality: 90
			});
			expect(result.src).toContain('quality=value:90');
		});

		it('should apply sharpen transformation', () => {
			const result = createFinalURL('sampleHandle', 100, 'crop', undefined, true, 'test', {
				sharpen: 10
			});
			expect(result.src).toContain('sharpen=amount:10');
		});

		it('should apply rotate transformation', () => {
			const result = createFinalURL('sampleHandle', 100, 'crop', undefined, true, 'test', {
				rotate: 90
			});
			expect(result.src).toContain('rotate=deg:90');
		});
		it('should apply watermark transformation', () => {
			const watermark: Watermark = {
				handle: 'watermarkHandle',
				size: 30,
				position: ['top', 'right']
			};
			const result = createFinalURL('sampleHandle', 100, 'crop', undefined, true, 'test', {
				watermark
			});
			expect(result.src).toContain('watermark=position:[top,right],file:watermarkHandle,size:30');
		});
	});

	describe('inImageCache', () => {
		it('should return false for an image not in cache', () => {
			const image: GraphAsset = {
				handle: 'sampleHandle1',
				width: 100,
				height: 100
			};
			expect(imageCache.seenBefore(image.handle)).toBe(false);
		});

		it('should add an image to cache when shouldCache is true', () => {
			const image: GraphAsset = {
				handle: 'sampleHandle2',
				width: 100,
				height: 100
			};
			expect(imageCache.seenBefore(image.handle)).toBe(false);
		});

		it('should return true for an image that is already in cache', () => {
			const image: GraphAsset = {
				handle: 'sampleHandle2',
				width: 100,
				height: 100
			};

			imageCache.cacheImage(image.handle);
			expect(imageCache.seenBefore(image.handle)).toBe(true);
		});
	});
});
