---
"graph-image": major
---

Svelte 5 Runes Upgrade

- Updated Package to use new Svelte 5 runes syntax
- Updated code to use Svelte Actions for client side only code.
- Added `layout` parameter for Image for more options of how the image is displayed on the page
- Updated all dependencies
- Updated srcset algorithm to pick more common device sizes and also support larger devices.
- You can now pass all HTML Image attributes & events to the Image component.  
- FadeIn for image is now purely CSS  you can edit the transition property with css variable `--graph-image-transition`