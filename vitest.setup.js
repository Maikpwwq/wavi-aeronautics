import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Automatically cleanup DOM after each test
afterEach(() => {
  cleanup()
})
