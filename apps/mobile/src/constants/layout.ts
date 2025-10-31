/**
 * Layout Constants
 *
 * Centralized layout dimensions and spacing values.
 * These constants ensure consistency across the app and make maintenance easier.
 *
 * @module constants/layout
 */

/**
 * Main layout heights
 */
export const LAYOUT = {
  /** Navbar height (top bar with title) */
  NAVBAR_HEIGHT: 56,

  /** Widget tabs height (tab selector bar) */
  WIDGET_TABS_HEIGHT: 48,

  /** Widget toggle bar height (collapse/expand bar) */
  WIDGET_TOGGLE_BAR_HEIGHT: 48,

  /** Widget expanded height as percentage of screen height */
  WIDGET_HEIGHT_PERCENTAGE: 0.3,

  /** Chat input bar minimum height */
  INPUT_BAR_MIN_HEIGHT: 60,

  /** Tab bar height (bottom navigation) */
  TAB_BAR_HEIGHT: 50,
} as const;

/**
 * Spacing scale (based on 4px grid)
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/**
 * Animation timing constants
 */
export const ANIMATION = {
  /** Keyboard animation duration (matches native keyboard) */
  KEYBOARD_DURATION: 250,

  /** Widget collapse/expand duration (synced with keyboard) */
  WIDGET_DURATION: 250,

  /** Quick animation for small interactions */
  QUICK_DURATION: 150,

  /** Smooth cubic bezier easing (professional feel) */
  SMOOTH_EASING: [0.25, 0.1, 0.25, 1] as const,

  /** Spring animation config (smooth, no bounce) */
  SPRING_CONFIG: {
    damping: 25,
    stiffness: 300,
    mass: 0.5,
  },
} as const;

/**
 * Z-index layers (maintain stacking order)
 */
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 1,
  WIDGET: 10,
  NAVBAR: 20,
  INPUT_BAR: 30,
  DRAWER: 100,
  MODAL: 200,
} as const;
