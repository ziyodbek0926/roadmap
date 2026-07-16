/**
 * SVG goo filter, mounted once in the root layout. GooeyButton references
 * it via `filter: url(#gooey-btn)`; the filter itself renders nothing
 * visible (0x0 svg), it just needs to exist somewhere in the DOM.
 */
export function GooFilter() {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <defs>
        <filter id="gooey-btn">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          {/* Sharpens the blurred alpha channel back into solid blobs that
              visually merge where they overlap -- the classic "goo" trick. */}
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
