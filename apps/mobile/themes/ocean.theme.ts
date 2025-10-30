/**
 * Ocean Theme Definition
 *
 * YBIS Ocean Theme - Deep blue underwater vibes
 */

export const oceanTheme = {
  // Base colors
  background: '#001F3F',
  backgroundHover: '#002645',
  backgroundPress: '#002D4D',
  backgroundFocus: '#002645',
  foreground: '#00D9FF',

  // Text colors
  color: '#00D9FF',
  colorHover: '#00F0FF',
  colorPress: '#00C0E0',
  colorFocus: '#00FFFF',

  // Grays (blue-tinted grays)
  gray1: '#00263D',
  gray2: '#002D45',
  gray3: '#00344D',
  gray4: '#003B55',
  gray5: '#00425D',
  gray6: '#004965',
  gray7: '#00566D',
  gray8: '#006D85',
  gray9: '#00849D',
  gray10: '#009BB5',
  gray11: '#00C8E0',
  gray12: '#E0F8FF',

  // Brand colors (ocean blues)
  blue1: '#001829',
  blue2: '#001F3F',
  blue3: '#002A52',
  blue4: '#003566',
  blue5: '#00407A',
  blue6: '#004B8E',
  blue7: '#0066B3',
  blue8: '#0080D8',
  blue9: '#00A8CC',
  blue10: '#00D9FF',
  blue11: '#33E0FF',
  blue12: '#B3F5FF',

  // Greens (turquoise ocean greens)
  green1: '#001E1E',
  green2: '#002626',
  green3: '#003232',
  green4: '#003E3E',
  green5: '#004A4A',
  green6: '#005656',
  green7: '#006A6A',
  green8: '#008888',
  green9: '#4ECDC4',
  green10: '#5ED7CE',
  green11: '#7FE5DD',
  green12: '#C7F5F2',

  // Reds (coral reds for ocean)
  red1: '#1E1416',
  red2: '#261619',
  red3: '#32181D',
  red4: '#3E1A21',
  red5: '#4A1F26',
  red6: '#56252B',
  red7: '#6A2F33',
  red8: '#883C3F',
  red9: '#FF6B6B',
  red10: '#FF7A7A',
  red11: '#FF9999',
  red12: '#FFC7C7',

  // Yellows (sand/beach yellows)
  yellow1: '#1E1A14',
  yellow2: '#261F16',
  yellow3: '#322618',
  yellow4: '#3E2E1A',
  yellow5: '#4A371F',
  yellow6: '#564025',
  yellow7: '#6A4F2F',
  yellow8: '#88653C',
  yellow9: '#FFE66D',
  yellow10: '#FFEB7A',
  yellow11: '#FFF099',
  yellow12: '#FFF7C7',

  // Oranges (sunset oranges)
  orange1: '#1E1614',
  orange2: '#261916',
  orange3: '#321E18',
  orange4: '#3E241A',
  orange5: '#4A2A1F',
  orange6: '#563125',
  orange7: '#6A3C2F',
  orange8: '#884D3C',
  orange9: '#FF8B3E',
  orange10: '#FF9A50',
  orange11: '#FFB070',
  orange12: '#FFD7C2',

  // UI elements
  borderColor: '#00425D',
  borderColorHover: '#00566D',
  borderColorPress: '#006D85',
  borderColorFocus: '#00D9FF',

  // Shadows
  shadowColor: '#00000030',
  shadowColorHover: '#00000040',
  shadowColorPress: '#00000050',
  shadowColorFocus: '#00D9FF40',
} as const;

export type ThemeTokens = typeof oceanTheme;
