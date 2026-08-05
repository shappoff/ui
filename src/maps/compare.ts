/**
 * Matches `@media (min-width: 40rem)` desktop compare chrome in styles.css.
 * Wide → vertical side-by-side swipe; narrow → horizontal.
 */
export const COMPARE_WIDE_MQ = "(min-width: 40rem)";

/**
 * Side-by-side swipe axis.
 * - `vertical` — divider runs top–bottom; left = base, right = overlay (desktop)
 * - `horizontal` — divider runs left–right; top = base, bottom = overlay (mobile)
 */
export type MapCompareSplitOrientation = "vertical" | "horizontal";
