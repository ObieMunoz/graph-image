import { bgColor, createFinalURL, inImageCache } from './_utils.js';
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
			const image = {
				handle: 'sampleHandle',
				width: 1920,
				height: 1080
			};

			const result = createFinalURL(
				image,
				true,
				'http://example.com',
				500,
				'crop',
				undefined,
				undefined,
				undefined,
				undefined
			);

			expect(result.sizes).toBe('(min-width: 500px) 500px, 100vw');

			const expectedSrcSet =
				'http://example.com/resize=w:125,h:1080,fit:crop/auto_image/compress/sampleHandle 125w,\n' +
				'http://example.com/resize=w:250,h:1080,fit:crop/auto_image/compress/sampleHandle 250w,\n' +
				'http://example.com/resize=w:500,h:1080,fit:crop/auto_image/compress/sampleHandle 500w,\n' +
				'http://example.com/resize=w:750,h:1080,fit:crop/auto_image/compress/sampleHandle 750w,\n' +
				'http://example.com/resize=w:1000,h:1080,fit:crop/auto_image/compress/sampleHandle 1000w,\n' +
				'http://example.com/resize=w:1500,h:1080,fit:crop/auto_image/compress/sampleHandle 1500w,\n' +
				'http://example.com/resize=w:1920,h:1080,fit:crop/auto_image/compress/sampleHandle 1920w';
			expect(result.srcset).toBe(expectedSrcSet);
		});

		it('should apply quality transformation', () => {
			const image = {
				handle: 'sampleHandle',
				width: 100,
				height: 200
			};
			const result = createFinalURL(
				image,
				true,
				'http://example.com',
				500,
				'crop',
				90,
				undefined,
				undefined,
				undefined
			);
			expect(result.src).toContain('quality=value:90');
		});

		it('should apply sharpen transformation', () => {
			const image = {
				handle: 'sampleHandle',
				width: 100,
				height: 200
			};
			const result = createFinalURL(
				image,
				true,
				'http://example.com',
				500,
				'crop',
				undefined,
				10,
				undefined,
				undefined
			);
			expect(result.src).toContain('sharpen=amount:10');
		});

		it('should apply rotate transformation', () => {
			const image = {
				handle: 'sampleHandle',
				width: 100,
				height: 200
			};
			const result = createFinalURL(
				image,
				true,
				'http://example.com',
				500,
				'crop',
				undefined,
				undefined,
				90,
				undefined
			);
			expect(result.src).toContain('rotate=deg:90');
		});

		it('should apply watermark transformation', () => {
			const image = {
				handle: 'sampleHandle',
				width: 100,
				height: 200
			};
			const watermark: Watermark = {
				handle: 'watermarkHandle',
				size: 30,
				position: ['top', 'right']
			};
			const result = createFinalURL(
				image,
				true,
				'http://example.com',
				500,
				'crop',
				undefined,
				undefined,
				undefined,
				undefined,
				watermark
			);
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
			expect(inImageCache(image, false)).toBe(false);
		});

		it('should add an image to cache when shouldCache is true', () => {
			const image: GraphAsset = {
				handle: 'sampleHandle2',
				width: 100,
				height: 100
			};
			expect(inImageCache(image, true)).toBe(false);
		});

		it('should return true for an image that is already in cache', () => {
			const image: GraphAsset = {
				handle: 'sampleHandle2',
				width: 100,
				height: 100
			};
			expect(inImageCache(image, false)).toBe(true);
		});

		it('should correctly cache an image through a sequence of operations', () => {
			const image: GraphAsset = {
				handle: 'sampleHandle3',
				width: 100,
				height: 100
			};
			expect(inImageCache(image, false)).toBe(false);
			expect(inImageCache(image, true)).toBe(false);
			expect(inImageCache(image, false)).toBe(true);
		});
	});
});
