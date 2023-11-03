import { writable, get } from 'svelte/store';
const imageCache = writable({});
let io;
const listeners = [];
export const createLoadObserver = (handler) => {
    let waiting = 0;
    const onload = (el) => {
        waiting++;
        el.addEventListener('load', () => {
            waiting--;
            if (waiting === 0) {
                handler();
            }
        });
    };
    return onload;
};
export function inImageCache(image, shouldCache) {
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
export function getIO() {
    if (!io && typeof window !== 'undefined') {
        io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                listeners.forEach((listener) => {
                    if (listener[0] === entry.target) {
                        // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
                        if (entry.isIntersecting || entry.intersectionRatio > 0) {
                            // when we intersect we cache the intersecting image for subsequent mounts
                            io.unobserve(listener[0]);
                            listener[1]();
                        }
                    }
                });
            });
        }, { rootMargin: '200px' });
    }
    if (!io) {
        throw new Error('IntersectionObserver is not available');
    }
    return io;
}
export function listenToIntersections(element, callback) {
    getIO().observe(element);
    listeners.push([element, callback]);
}
export function bgColor(backgroundColor) {
    return typeof backgroundColor === 'boolean' ? 'lightgray' : backgroundColor;
}
export function resizeImage({ width, height, fit }) {
    return `resize=w:${width},h:${height},fit:${fit}`;
}
export function compressAndWebp(webp) {
    return `${webp ? 'auto_image/' : ''}compress`;
}
export function constructURL(handle, withWebp, baseURI) {
    return function (resize) {
        return function (transforms) {
            return [baseURI, resize, ...transforms, compressAndWebp(withWebp), handle].join('/');
        };
    };
}
export function responsiveSizes(size) {
    return [size / 4, size / 2, size, size * 1.5, size * 2, size * 3];
}
export function getWidths(width, maxWidth) {
    const sizes = responsiveSizes(maxWidth).filter((size) => size < width);
    // Add the original width to ensure the largest image possible is available for small images.
    const finalSizes = [...sizes, width];
    return finalSizes;
}
export function srcSet(srcBase, srcWidths, height, fit, transforms) {
    return srcWidths
        .map((width) => {
        const resizeOption = `resize=w:${Math.floor(width)},h:${Math.floor(height)},fit:${fit}`;
        const src = srcBase(resizeOption)(transforms);
        return `${src} ${Math.floor(width)}w`;
    })
        .join(',\n');
}
export function imgSizes(maxWidth) {
    return `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`;
}
export function createWatermarkTransformation(watermark) {
    const { handle, size, position } = watermark;
    const defaultVertical = 'middle';
    const verticalPositions = {
        top: true,
        middle: true,
        bottom: true
    };
    let positionStr;
    if (Array.isArray(position)) {
        positionStr = `${position[0]},${position[1]}`;
    }
    else if (verticalPositions[position]) {
        positionStr = position;
    }
    else {
        positionStr = `${defaultVertical},${position}`;
    }
    const sizeStr = size !== undefined ? `,size:${size}` : '';
    return `watermark=position:[${positionStr}],file:${handle}${sizeStr}`;
}
export function createFinalURL(image, withWebp, baseURI, maxWidth, fit, quality, sharpen, rotate, watermark) {
    const transforms = createTransformations(quality, sharpen, rotate, watermark);
    const srcBase = constructURL(image.handle, withWebp, baseURI);
    const thumbBase = constructURL(image.handle, false, baseURI);
    const sizedSrc = srcBase(resizeImage({ width: image.width, height: image.height, fit }));
    const finalSrc = sizedSrc(transforms);
    const thumbSize = { width: 20, height: 20, fit: 'crop' };
    const thumbSrc = thumbBase(resizeImage(thumbSize))(['blur=amount:2']);
    const srcSetImgs = srcSet(srcBase, getWidths(image.width, maxWidth), image.height, fit, transforms);
    const sizes = imgSizes(maxWidth);
    return {
        finalSrc,
        thumbSrc,
        srcSetImgs,
        sizes
    };
}
function createTransformations(quality, sharpen, rotate, watermark) {
    const transforms = [];
    if (quality && quality > 0 && quality <= 100) {
        transforms.push(`quality=value:${quality}`);
    }
    if (sharpen && sharpen <= 20) {
        transforms.push(`sharpen=amount:${sharpen}`);
    }
    if (rotate && rotate > 0 && rotate < 360) {
        transforms.push(`rotate=deg:${rotate}`);
    }
    if (watermark) {
        transforms.push(createWatermarkTransformation(watermark));
    }
    return transforms;
}
