import { Select, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'

export interface FontOption {
  value: string
  label: string
  category: 'sans-serif' | 'serif' | 'display' | 'monospace'
  weights?: string
}

export const CURATED_FONTS: FontOption[] = [
  {
    value: 'Outfit, system-ui, sans-serif',
    label: 'Outfit',
    category: 'sans-serif',
    weights: '300,400,500,600,700',
  },
  {
    value: 'DM Sans, system-ui, sans-serif',
    label: 'DM Sans',
    category: 'sans-serif',
    weights: '400,500,700',
  },
  {
    value: 'Plus Jakarta Sans, system-ui, sans-serif',
    label: 'Plus Jakarta Sans',
    category: 'sans-serif',
    weights: '400,500,600,700',
  },
  {
    value: 'Manrope, system-ui, sans-serif',
    label: 'Manrope',
    category: 'sans-serif',
    weights: '400,500,600,700',
  },
  {
    value: 'Lexend, system-ui, sans-serif',
    label: 'Lexend',
    category: 'sans-serif',
    weights: '300,400,500,600',
  },
  {
    value: 'Work Sans, system-ui, sans-serif',
    label: 'Work Sans',
    category: 'sans-serif',
    weights: '400,500,600',
  },
  {
    value: 'Raleway, system-ui, sans-serif',
    label: 'Raleway',
    category: 'sans-serif',
    weights: '400,500,600,700',
  },
  {
    value: 'Syne, system-ui, sans-serif',
    label: 'Syne',
    category: 'display',
    weights: '400,600,700',
  },
  {
    value: 'Questrial, system-ui, sans-serif',
    label: 'Questrial',
    category: 'sans-serif',
    weights: '400',
  },
  {
    value: 'Archivo, system-ui, sans-serif',
    label: 'Archivo',
    category: 'sans-serif',
    weights: '400,500,600,700',
  },
  {
    value: 'Instrument Sans, system-ui, sans-serif',
    label: 'Instrument Sans',
    category: 'sans-serif',
    weights: '400,500,600,700',
  },
  {
    value: 'Fraunces, Georgia, serif',
    label: 'Fraunces',
    category: 'serif',
    weights: '400,600,700',
  },
  {
    value: 'JetBrains Mono, monospace',
    label: 'JetBrains Mono',
    category: 'monospace',
    weights: '400,500,600',
  },
]

interface FontPickerProps {
  value: string
  onChange: (value: string) => void
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [previewText] = useState('The quick brown fox jumps over the lazy dog')
  const currentFont = CURATED_FONTS.find((font) => font.value === value)

  useEffect(() => {
    if (!currentFont) return

    const linkId = 'font-picker-preview'
    let link = document.getElementById(linkId) as HTMLLinkElement

    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }

    const fontName = currentFont.label.replace(/\s+/g, '+')
    const weights = currentFont.weights ? `:wght@${currentFont.weights}` : ''
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}${weights}&display=swap`
  }, [currentFont])

  return (
    <Stack gap="xs">
      <Select
        label="Font family"
        value={value}
        onChange={(val) => val && onChange(val)}
        data={CURATED_FONTS.map((font) => ({
          value: font.value,
          label: font.label,
        }))}
        searchable
        comboboxProps={{ withinPortal: true }}
      />
      <div
        style={{
          padding: '0.75rem',
          background: 'var(--mantine-color-default-hover)',
          borderRadius: 'var(--mantine-radius-sm)',
          fontFamily: value,
          fontSize: '0.9rem',
          lineHeight: 1.6,
        }}
      >
        <Text size="xs" c="dimmed" mb={4} style={{ fontFamily: 'inherit' }}>
          Preview ({currentFont?.category || 'custom'}):
        </Text>
        <Text style={{ fontFamily: 'inherit' }}>{previewText}</Text>
      </div>
    </Stack>
  )
}
