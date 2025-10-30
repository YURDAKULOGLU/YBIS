/**
 * Light Theme Definition
 *
 * YBIS Light Theme - Default light mode colors
 */

export const lightTheme = {
  // Base colors
  background: '#FFFFFF',
  backgroundHover: '#FAFAFA',
  backgroundPress: '#F5F5F5',
  backgroundFocus: '#FAFAFA',
  foreground: '#000000',

  // Text colors
  color: '#000000',
  colorHover: '#1A1A1A',
  colorPress: '#2A2A2A',
  colorFocus: '#0A0A0A',

  // Grays (design system)
  gray1: '#FCFCFC',
  gray2: '#F9F9F9',
  gray3: '#F0F0F0',
  gray4: '#E8E8E8',
  gray5: '#E0E0E0',
  gray6: '#D9D9D9',
  gray7: '#CECECE',
  gray8: '#BBBBBB',
  gray9: '#8D8D8D',
  gray10: '#838383',
  gray11: '#646464',
  gray12: '#202020',

  // Brand colors (blues)
  blue1: '#FBFDFF',
  blue2: '#F4FAFF',
  blue3: '#E6F4FE',
  blue4: '#D5EFFF',
  blue5: '#C2E5FF',
  blue6: '#ACDEFF',
  blue7: '#8ECCFF',
  blue8: '#5EB1EF',
  blue9: '#0090FF',
  blue10: '#0588F0',
  blue11: '#0D74CE',
  blue12: '#113264',

  // Greens
  green1: '#FBFEFC',
  green2: '#F4FBF6',
  green3: '#E6F6EB',
  green4: '#D6F1DF',
  green5: '#C4E8CA',
  green6: '#ADDDC0',
  green7: '#8ECEAA',
  green8: '#5BB98B',
  green9: '#30A46C',
  green10: '#2B9A66',
  green11: '#218358',
  green12: '#193B2D',

  // Reds
  red1: '#FFFCFC',
  red2: '#FFF7F7',
  red3: '#FEEBEC',
  red4: '#FFDBDC',
  red5: '#FFCDCE',
  red6: '#FDBDBE',
  red7: '#F4A9AA',
  red8: '#EB8E90',
  red9: '#E5484D',
  red10: '#DC3E42',
  red11: '#CE2C31',
  red12: '#641723',

  // Yellows
  yellow1: '#FDFDF9',
  yellow2: '#FFFCE8',
  yellow3: '#FFFBD1',
  yellow4: '#FFF8BB',
  yellow5: '#FEF2A4',
  yellow6: '#F9E68C',
  yellow7: '#EFD36C',
  yellow8: '#EBBC00',
  yellow9: '#F5D90A',
  yellow10: '#F7CE00',
  yellow11: '#946800',
  yellow12: '#35290F',

  // Oranges
  orange1: '#FEFCFB',
  orange2: '#FFF7ED',
  orange3: '#FFEFD6',
  orange4: '#FFDFB5',
  orange5: '#FFD19A',
  orange6: '#FFC182',
  orange7: '#FFAE63',
  orange8: '#FB9337',
  orange9: '#FF8B3E',
  orange10: '#FF802B',
  orange11: '#CC5F00',
  orange12: '#582D1D',

  // UI elements
  borderColor: '#E0E0E0',
  borderColorHover: '#D9D9D9',
  borderColorPress: '#CECECE',
  borderColorFocus: '#0090FF',

  // Shadows
  shadowColor: '#00000015',
  shadowColorHover: '#00000020',
  shadowColorPress: '#00000030',
  shadowColorFocus: '#0090FF30',
} as const;

export type ThemeTokens = typeof lightTheme;
