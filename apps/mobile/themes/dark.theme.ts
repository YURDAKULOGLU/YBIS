/**
 * Dark Theme Definition
 *
 * YBIS Dark Theme - Default dark mode colors
 */

export const darkTheme = {
  // Base colors
  background: '#000000',
  backgroundHover: '#0A0A0A',
  backgroundPress: '#141414',
  backgroundFocus: '#0A0A0A',
  foreground: '#FFFFFF',

  // Text colors
  color: '#FFFFFF',
  colorHover: '#F5F5F5',
  colorPress: '#E5E5E5',
  colorFocus: '#FAFAFA',

  // Grays (design system)
  gray1: '#111111',
  gray2: '#191919',
  gray3: '#222222',
  gray4: '#2A2A2A',
  gray5: '#313131',
  gray6: '#3A3A3A',
  gray7: '#484848',
  gray8: '#606060',
  gray9: '#6E6E6E',
  gray10: '#7B7B7B',
  gray11: '#B4B4B4',
  gray12: '#EEEEEE',

  // Brand colors (blues)
  blue1: '#0F1419',
  blue2: '#0E1B26',
  blue3: '#0D2847',
  blue4: '#003362',
  blue5: '#004074',
  blue6: '#104D87',
  blue7: '#205D9E',
  blue8: '#2870BD',
  blue9: '#0090FF',
  blue10: '#3B9EFF',
  blue11: '#70B8FF',
  blue12: '#C2E6FF',

  // Greens
  green1: '#0E1512',
  green2: '#121B17',
  green3: '#132D21',
  green4: '#113B29',
  green5: '#174933',
  green6: '#20573E',
  green7: '#28684A',
  green8: '#2F7C57',
  green9: '#30A46C',
  green10: '#33B074',
  green11: '#3DD68C',
  green12: '#B1F1CB',

  // Reds
  red1: '#191111',
  red2: '#201314',
  red3: '#3B1219',
  red4: '#500F1C',
  red5: '#611623',
  red6: '#72232D',
  red7: '#8C333A',
  red8: '#B54548',
  red9: '#E5484D',
  red10: '#EC5D5E',
  red11: '#FF9592',
  red12: '#FFD1D9',

  // Yellows
  yellow1: '#14120B',
  yellow2: '#1B180F',
  yellow3: '#2D2305',
  yellow4: '#362B00',
  yellow5: '#433500',
  yellow6: '#524202',
  yellow7: '#665417',
  yellow8: '#836A21',
  yellow9: '#F5D90A',
  yellow10: '#FFEF5C',
  yellow11: '#F0C000',
  yellow12: '#FFF7B8',

  // Oranges
  orange1: '#17120E',
  orange2: '#1E160F',
  orange3: '#331E0B',
  orange4: '#462100',
  orange5: '#562800',
  orange6: '#66350C',
  orange7: '#7E451D',
  orange8: '#A35829',
  orange9: '#FF8B3E',
  orange10: '#FF9D5C',
  orange11: '#FFAF7D',
  orange12: '#FFE0C2',

  // UI elements
  borderColor: '#313131',
  borderColorHover: '#3A3A3A',
  borderColorPress: '#484848',
  borderColorFocus: '#0090FF',

  // Shadows
  shadowColor: '#00000050',
  shadowColorHover: '#00000060',
  shadowColorPress: '#00000070',
  shadowColorFocus: '#0090FF40',
} as const;

export type ThemeTokens = typeof darkTheme;
