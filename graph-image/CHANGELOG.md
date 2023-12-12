# graph-image

## 0.2.3

### Patch Changes

- 9972675: Added experimental fit option: center-contain

## 0.2.2

### Patch Changes

- e2ad668: Fixed placeholder loading state

## 0.2.1

### Patch Changes

- fa77847: Bump package versions

## 0.2.0

### Minor Changes

- 9b38f84: - Fixed bug where images were being stretched to fit their container. This could cause some incompatibilities if your layout depended on this bug hence why this is a minor
  - Fixed bug where images were pinned to 800px regardless of actual size.

## 0.1.8

### Patch Changes

- 9e7ba5a: - Add more efficent image load check
  - Fixed SSR for `eager` image
  - Fixed CSR on Sveltekit by making props reactive
  - Clean up styles for opacity

## 0.1.7

### Patch Changes

- abd3b1b: Implemented an option for eager loading which will prioritize the load by placing an image preload link in the document head

## 0.1.6

### Patch Changes

- 8c1739f: Resolved an issue where height was not being passed to srcset images

## 0.1.5

### Patch Changes

- 0fe65be: Impl. Support for Watermarking, Quality, Sharpen, and Rotational values

## 0.1.4

### Patch Changes

- ca871eb: Moved @changesets/cli to dev dependencies

## 0.1.3

### Patch Changes

- 4dd03e8: Update package metadata

## 0.1.2

### Patch Changes

- 801715c: Added GH Actions/workflow for npm publishing
- 390389c: Minor updates
- 801715c: Fixed minor rendering issue with image widths

## 0.1.1

### Patch Changes

- Impl. changesets

## 0.1.0

### Minor Changes

- Changed name to graph-image and released package on npmjs

## 0.0.2

### Patch Changes

- Fixed several rendering bugs

## 0.0.1

### Patch Changes

- Initial release
