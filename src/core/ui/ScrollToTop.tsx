import { ActionIcon, Transition } from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <Transition
      mounted={scroll.y > 400}
      transition="slide-up"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          style={{
            ...styles,
            position: 'fixed',
            bottom: 'calc(1rem + env(safe-area-inset-bottom))',
            right: '1rem',
            zIndex: 100,
            boxShadow: 'var(--mantine-shadow-md)',
          }}
          onClick={() => scrollTo({ y: 0 })}
          aria-label="Scroll to top"
          className="scroll-to-top-btn"
        >
          <ArrowUp size={18} />
        </ActionIcon>
      )}
    </Transition>
  )
}
