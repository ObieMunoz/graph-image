import { SvelteComponent } from "svelte";
import { GraphImageTypes } from 'graph-image';
declare const __propDef: {
    props: {
        logo: GraphImageTypes.GraphAsset;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type BannerProps = typeof __propDef.props;
export type BannerEvents = typeof __propDef.events;
export type BannerSlots = typeof __propDef.slots;
export default class Banner extends SvelteComponent<BannerProps, BannerEvents, BannerSlots> {
}
export {};
