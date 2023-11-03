import { SvelteComponent } from "svelte";
import type { Fit, GraphAsset, Load, Watermark } from './types.ts';
declare const __propDef: {
    props: {
        image: GraphAsset;
        maxWidth?: number | undefined;
        fadeIn?: boolean | undefined;
        fit?: Fit | undefined;
        withWebp?: boolean | undefined;
        title?: string | undefined;
        alt?: string | undefined;
        style?: Record<string, any> | undefined;
        blurryPlaceholder?: boolean | undefined;
        backgroundColor?: string | boolean | undefined;
        baseURI?: string | undefined;
        quality?: number | undefined;
        sharpen?: number | undefined;
        rotate?: number | undefined;
        watermark?: Watermark | undefined;
        load?: Load | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type GraphImageProps = typeof __propDef.props;
export type GraphImageEvents = typeof __propDef.events;
export type GraphImageSlots = typeof __propDef.slots;
export default class GraphImage extends SvelteComponent<GraphImageProps, GraphImageEvents, GraphImageSlots> {
}
export {};
//# sourceMappingURL=GraphImage.svelte.d.ts.map