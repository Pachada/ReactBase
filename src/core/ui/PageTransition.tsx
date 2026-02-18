import { motion } from 'framer-motion'
import { type PropsWithChildren } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
}

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
