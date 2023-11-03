import { SvelteComponent } from "svelte";
import type { Load } from './types.js';
declare const __propDef: {
    props: {
        [x: string]: any;
        src: string;
        alt: string;
        opacity?: 0 | 1 | undefined;
        transitionDelay?: string | undefined;
        transition?: string | undefined;
        load?: Load | undefined;
    };
    events: {
        load: Event;
        imageLoad: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ImageProps = typeof __propDef.props;
export type ImageEvents = typeof __propDef.events;
export type ImageSlots = typeof __propDef.slots;
export default class Image extends SvelteComponent<ImageProps, ImageEvents, ImageSlots> {
}
export {};
//# sourceMappingURL=Image.svelte.d.ts.map