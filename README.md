![Graph Image](apps/demo/static/graph-image.png)

# graph-image

Advanced Lazy-Loading and Compression with Svelte/SvelteKit and Hygraph

[![npm version](https://img.shields.io/npm/v/graph-image)](https://npmjs.org/package/graph-image)
[![downloads](https://img.shields.io/npm/dt/graph-image)](https://npmjs.org/package/graph-image)
[![release status](https://img.shields.io/github/actions/workflow/status/obiemunoz/graph-image/.github%2Fworkflows%2Frelease.yml?logo=github&label=release)](https://github.com/ObieMunoz/graph-image/actions/workflows/release.yml)
[![stars](https://img.shields.io/github/stars/obiemunoz/graph-image)](https://www.github.com/obiemunoz/graph-image)
[![demo status](https://img.shields.io/website?up_message=operational&down_message=failure&url=https%3A%2F%2Fgraph-image.obiemunoz.com&label=demo)](https://graph-image.obiemunoz.com)

[Demo](https://graph-image.obiemunoz.com) • [Obie Munoz](https://www.obiemunoz.com/)

- Automatically resize images according to your design specifications
- Dynamically serve .webp format where supported, ensuring modern compression techniques are utilized for faster load times
- Generate device-specific variants to ensure optimal download size
- Prioritize initial page speed and conserve bandwidth
- Employ the 'blur-in' technique or a solid background for seamless image loading experiences
- Prevent page layout jumps with consistent image positioning

**Special thanks** to the creators and contributors of [@graphcms/react-image](https://npmjs.org/package/@graphcms/react-image) for the work in React this project was based on.

## Quickstart

Here's an example using a static asset object.

```html
<script>
    import { GraphImage } from "graph-image";

    const asset = {
        handle: "uQrLj1QRWKJnlQv1sEmC",
        width: 800,
        height: 800
    }
</script>

<GraphImage image={asset} maxWidth={800} />
<GraphImage
	title="Example 2"
	alt="Example 2"
	image={{ handle: asset.handle, width: 1920, height: 1080 }}
	withWebp
	maxWidth={500}
	style={{
		width: '500px',
		margin: '32px 16px'
	}}
/>
```

## Props

| Name                | Type                             | Description                                                                                                                                                                                                                                                                            |
| ------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`             | `object`                         | An object of shape `{ handle, width, height }`. Handle is an identifier required to display the image and both `width` and `height` are required to display a correct placeholder and aspect ratio for the image. You can get all 3 by just putting all 3 in your image-getting query. |
| `maxWidth`          | `number`                         | Maximum width you'd like your image to take up. (ex. If your image container is resizing dynamically up to a width of 1200, put it as a `maxWidth`) |
| `fadeIn`            | `bool`                           | Do you want your image to fade in on load? Defaults to `true` |
| `fit`               | `"clip"\|"crop"\|"scale"\|"max"` | When resizing the image, how would you like it to fit the new dimensions? Defaults to `crop`. You can read more about resizing [here](https://www.filestack.com/docs/api/processing/#resize) |
| `withWebp`          | `bool`                           | If webp is supported by the browser, the images will be served with `.webp` extension. (Recommended) |
| `title`             | `string`                         | Passed to the `img` element |
| `alt`               | `string`                         | Passed to the `img` element |
| `style`             | `object`                         | Spread into the default styles in the wrapper div |
| `position`          | `string`                         | Defaults to `relative`. Pass in `absolute` to make the component `absolute` positioned |
| `blurryPlaceholder` | `bool`                           | Would you like to display a blurry placeholder for your loading image? Defaults to `true`. |
| `backgroundColor`   | `string\|bool`                   | Set a colored background placeholder. If true, uses "lightgray" for the color. You can also pass in any valid color string. |
| `baseURI`           | `string`                         | Set the base src from where the images are requested. Base URI Defaults to `https://media.graphassets.com` |
| `quality`           | `number`			             | Set the image quality value between 1 & 100 |
| `sharpen`           | `number`			             | Set the image sharpen value between 0 and 20 |
| `rotate`            | `number`                         | Set the image rotation between 0 & 360 degrees |
| `watermark`         | `object`                         | An object of shape `{ handle, size, position }`. Handle is an identifier required to display the image. `size` is an optional `number`. `position` is required and can either be a `string` `HorizontalPosition` or a `tuple` of shape `[VerticalPosition, HorizontalPosition]` where `VerticalPosition` can be `'top' \| 'middle' \| 'bottom'` and `HorizontalPosition` can be `'left' \| 'center' \| 'right` |
| `load` 			  | `"lazy"\|"eager"` 			             | To prioritize loading speed, set `load` to `eager`. This will place preload tags in the `<head>` and will remove transition effects. Defaults to `lazy`. |
