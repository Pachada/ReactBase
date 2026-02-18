import { DEFAULT_THEME } from '@mantine/core'

export const BRAND_COLOR_SCALE = [
  '#edf4ff',
  '#dbe6ff',
  '#b7ccff',
  '#8caeff',
  '#6693ff',
  '#457cff',
  '#316dff',
  '#2459df',
  '#1f4db3',
  '#1f458c',
] as const

export const CLIENT_FOREST_COLOR_SCALE = [
  '#f3f5f1',
  '#e7ece4',
  '#dad7cd',
  '#c3cdb4',
  '#a3b18a',
  '#7d9a72',
  '#588157',
  '#4a6f4d',
  '#3a5a40',
  '#344e41',
] as const

export const PRIMARY_COLOR_PRESETS = [
  {
    value: 'indigo',
    label: 'Indigo',
    previewColor: DEFAULT_THEME.colors.indigo[6],
  },
  {
    value: 'blue',
    label: 'Blue',
    previewColor: DEFAULT_THEME.colors.blue[6],
  },
  {
    value: 'teal',
    label: 'Teal',
    previewColor: DEFAULT_THEME.colors.teal[6],
  },
  {
    value: 'grape',
    label: 'Grape',
    previewColor: DEFAULT_THEME.colors.grape[6],
  },
  {
    value: 'brand',
    label: 'Brand',
    previewColor: BRAND_COLOR_SCALE[6],
  },
  {
    value: 'clientForest',
    label: 'Client Forest',
    previewColor: CLIENT_FOREST_COLOR_SCALE[6],
  },
] as const

export type PrimaryColorPreset = (typeof PRIMARY_COLOR_PRESETS)[number]['value']

export const DEFAULT_PRIMARY_COLOR_PRESET: PrimaryColorPreset = 'indigo'

export const CUSTOM_THEME_COLORS = {
  brand: BRAND_COLOR_SCALE,
  clientForest: CLIENT_FOREST_COLOR_SCALE,
}

export function isPrimaryColorPreset(value: string): value is PrimaryColorPreset {
  return PRIMARY_COLOR_PRESETS.some((preset) => preset.value === value)
}
