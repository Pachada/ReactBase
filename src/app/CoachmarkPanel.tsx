import { Button, Group, Stack, Text } from '@mantine/core'

interface CoachmarkPanelProps {
  title: string
  description: string
  step: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  onComplete: () => void
}

export function CoachmarkPanel({
  title,
  description,
  step,
  totalSteps,
  onNext,
  onBack,
  onComplete,
}: CoachmarkPanelProps) {
  return (
    <div className="coachmark-panel" role="dialog" aria-live="polite">
      <Stack gap={6}>
        <Text size="sm" fw={600}>
          {title}
        </Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <Group justify="space-between" mt={4}>
          <Button
            size="compact-xs"
            variant="subtle"
            onClick={onBack}
            disabled={step === 0}
          >
            Back
          </Button>
          <Group gap={6}>
            <Button size="compact-xs" variant="default" onClick={onComplete}>
              Skip
            </Button>
            <Button size="compact-xs" onClick={onNext}>
              {step >= totalSteps - 1 ? 'Finish' : 'Next'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </div>
  )
}
