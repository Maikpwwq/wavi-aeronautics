import React, { useState, useEffect, useRef } from 'react'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'

const RevealOnScroll = ({ children, threshold = 0.1, delay = 0, duration = 1000 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once visible, set to true and disconnect (so it doesn't fade out again)
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold // Trigger when percentage of element is visible
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return (
    <Box ref={ref} sx={{ minHeight: '50px' }}>
       {/* Use timeout to control duration (MUI Fade uses standard/enteringScreen constants usually, but timeout prop works) */}
      <Fade in={isVisible} timeout={duration} style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}>
        <Box>
           {children}
        </Box>
      </Fade>
    </Box>
  )
}

export default RevealOnScroll
