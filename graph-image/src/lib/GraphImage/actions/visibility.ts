import type { ActionReturn } from 'svelte/action';

type Options = {
	rootMargin?: string;
	threshold?: number;
};

export function visibility(
	node: HTMLElement,
	params: Options = { rootMargin: '200px' }
): ActionReturn<Options, { onintersect: () => void }> {
	const IOSupported = typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined';

	// Handle IntersectionObserver not supported
	if (!IOSupported) {
		node.dispatchEvent(new CustomEvent('intersect', { detail: true }));
	}

	let intObserver = GetIntersectionObserver(node, params);

	intObserver.observe(node);

	return {
		update(newOptions) {
			if (!IOSupported) {
				return;
			}
			intObserver.disconnect();
			intObserver = GetIntersectionObserver(node, newOptions);
			intObserver.observe(node);
		},
		destroy() {
			intObserver.disconnect();
		}
	};
}

function GetIntersectionObserver(node: HTMLElement, options: Options) {
	const intObserver = new IntersectionObserver((entries) => {
		entries.forEach((_entry) => {
			if (_entry.isIntersecting || _entry.intersectionRatio > 0) {
				node.dispatchEvent(new CustomEvent('intersect', { detail: true }));
				intObserver.unobserve(node);
			}
		});
	}, options);

	return intObserver;
}
