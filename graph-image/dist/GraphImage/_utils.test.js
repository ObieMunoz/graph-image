import { createLoadObserver, srcSet, bgColor, resizeImage, compressAndWebp, constructURL, responsiveSizes, getWidths, imgSizes } from './_utils.js';
import { describe, it, expect } from 'vitest';
describe('_utils.ts // Utility Functions', () => {
    describe('createLoadObserver', () => {
        it('should increment and decrement waiting count and call handler appropriately', async () => {
            let handlerCalled = false;
            const handler = () => {
                handlerCalled = true;
            };
            const mockElement = () => {
                const listeners = {};
                return {
                    addEventListener: (event, callback) => {
                        if (!listeners[event]) {
                            listeners[event] = [];
                        }
                        listeners[event].push(callback);
                    },
                    trigger: (event) => {
                        const eventListeners = listeners[event];
                        if (eventListeners) {
                            for (const callback of eventListeners) {
                                callback();
                            }
                        }
                    }
                };
            };
            const onload = createLoadObserver(handler);
            const el1 = mockElement();
            const el2 = mockElement();
            onload(el1);
            onload(el2);
            expect(handlerCalled).toBe(false);
            el1.trigger('load');
            expect(handlerCalled).toBe(false);
            el2.trigger('load');
            expect(handlerCalled).toBe(true);
        });
    });
    describe('bgColor', () => {
        it('should return lightgray when input is boolean', () => {
            expect(bgColor(true)).toBe('lightgray');
            expect(bgColor(false)).toBe('lightgray');
        });
        it('should return the input string when input is a string', () => {
            expect(bgColor('red')).toBe('red');
        });
    });
    describe('resizeImage', () => {
        it('should return a formatted resize string', () => {
            const result = resizeImage({ width: 100, height: 200, fit: 'cover' });
            expect(result).toBe('resize=w:100,h:200,fit:cover');
        });
    });
    describe('compressAndWebp', () => {
        it('should add auto_image when webp is true', () => {
            expect(compressAndWebp(true)).toBe('auto_image/compress');
        });
        it('should not add auto_image when webp is false', () => {
            expect(compressAndWebp(false)).toBe('compress');
        });
    });
    describe('constructURL', () => {
        it('should construct a URL based on input parameters', () => {
            const construct = constructURL('sampleHandle', true, 'http://example.com');
            const resizeFunc = construct('resize_string');
            const result = resizeFunc(['transform1', 'transform2']);
            expect(result).toBe('http://example.com/resize_string/transform1/transform2/auto_image/compress/sampleHandle');
        });
    });
    describe('responsiveSizes', () => {
        it('should return an array of responsive sizes', () => {
            const sizes = responsiveSizes(100);
            expect(sizes).toEqual([25, 50, 100, 150, 200, 300]);
        });
    });
    describe('getWidths', () => {
        it('should return widths less than the provided width from responsiveSizes', () => {
            const widths = getWidths(500, 400);
            expect(widths).toEqual([100, 200, 400, 500]);
        });
    });
    describe('srcSet', () => {
        it('should generate a srcSet string based on provided parameters', () => {
            const mockSrcBase = (resize) => (transforms) => {
                return `http://example.com/${resize}/${transforms.join('/')}`;
            };
            const mockSrcWidths = [100, 200, 300];
            const mockFit = 'cover';
            const mockTransforms = ['transform1', 'transform2'];
            const result = srcSet(mockSrcBase, mockSrcWidths, 300, mockFit, mockTransforms);
            expect(result).toBe(`http://example.com/resize=w:100,h:300,fit:cover/transform1/transform2 100w,\n` +
                `http://example.com/resize=w:200,h:300,fit:cover/transform1/transform2 200w,\n` +
                `http://example.com/resize=w:300,h:300,fit:cover/transform1/transform2 300w`);
        });
    });
    describe('imgSizes', () => {
        it('should generate an imgSizes string based on maxWidth', () => {
            const maxWidth = 500;
            const result = imgSizes(maxWidth);
            expect(result).toBe('(max-width: 500px) 100vw, 500px');
        });
    });
});
