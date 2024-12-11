import type { ImageCacheType } from './types';

class ImageCache {
	cache = $state<ImageCacheType>({});

	cacheImage(handle: string) {
		this.cache[handle] = true;
	}

	seenBefore(handle: string) {
		return this.cache[handle] === true;
	}
}

export const imageCache = new ImageCache();
