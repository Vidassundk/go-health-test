/**
 * Base unit for wheel picker layout.
 * - ×4 = item height
 * - ×2 = font line height (headingSemiRight)
 * - Centering offset: scales as −PICKER_BASE minus (PICKER_BASE − 14) / 2,
 *   since the selection drift grows at half-rate when PICKER_BASE increases.
 */
export const PICKER_BASE = 20;

const PICKER_BASE_CALIBRATED = 14;

export const WHEEL_ITEM_HEIGHT = PICKER_BASE * 4;
export const WHEEL_LINE_HEIGHT = PICKER_BASE * 2;
export const WHEEL_CENTER_OFFSET =
  -PICKER_BASE - (PICKER_BASE - PICKER_BASE_CALIBRATED);

export const WHEEL_CHROME_HEIGHT = 58;
