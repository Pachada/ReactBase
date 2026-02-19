import { Box, Group, SegmentedControl, Stack, UnstyledButton } from '@mantine/core'
import { Palette, User } from 'lucide-react'
import { useState } from 'react'
import { ProfileSection } from './ProfileSection'
import { AppearanceSection } from './AppearanceSection'

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = 'profile' | 'appearance'

// ─── Section nav ──────────────────────────────────────────────────────────────

const SECTIONS: Array<{ id: Section; label: string; icon: typeof User }> = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

function SectionNavItem({
  section,
  active,
  onClick,
}: {
  section: (typeof SECTIONS)[number]
  active: boolean
  onClick: () => void
}) {
  const Icon = section.icon
  return (
    <UnstyledButton
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 'var(--mantine-radius-md)',
        background: active ? 'var(--mantine-primary-color-light)' : 'transparent',
        color: active
          ? 'var(--mantine-primary-color-filled)'
          : 'var(--mantine-color-text)',
        fontWeight: active ? 600 : 400,
        width: '100%',
        transition: 'background 0.15s ease, color 0.15s ease',
        fontSize: 'var(--mantine-font-size-sm)',
        opacity: active ? 1 : 0.75,
      }}
    >
      <Icon size={15} />
      {section.label}
    </UnstyledButton>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile')

  return (
    <Box>
      <Group
        align="flex-start"
        gap="xl"
        wrap="nowrap"
        style={{ alignItems: 'flex-start' }}
      >
        {/* Left nav — desktop only */}
        <Box
          visibleFrom="sm"
          style={{ width: 192, flexShrink: 0, position: 'sticky', top: 80 }}
        >
          <Stack gap={2}>
            {SECTIONS.map((section) => (
              <SectionNavItem
                key={section.id}
                section={section}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </Stack>
        </Box>

        {/* Content (flex: 1 to fill remaining space) */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile: horizontal tab bar above content */}
          <Box hiddenFrom="sm" mb="md">
            <SegmentedControl
              value={activeSection}
              onChange={(v) => setActiveSection(v as Section)}
              fullWidth
              data={SECTIONS.map((s) => ({ value: s.id, label: s.label }))}
            />
          </Box>

          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'appearance' && <AppearanceSection />}
        </Box>
      </Group>
    </Box>
  )
}
