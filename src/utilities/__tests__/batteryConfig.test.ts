import { describe, it, expect } from 'vitest'
import {
  BATTERY_CELL_OPTIONS,
  matchesBatteryCell,
  getBatteryCellCounts
} from '../batteryConfig'

describe('batteryConfig & Battery Cell (Voltage) Matching Logic', () => {
  describe('BATTERY_CELL_OPTIONS', () => {
    it('defines the 7 canonical battery cell counts including 1S to 6S and 12S', () => {
      const ids = BATTERY_CELL_OPTIONS.map((opt) => opt.id)
      expect(ids).toEqual(['1S', '2S', '3S', '4S', '5S', '6S', '12S'])
    })
  })

  describe('matchesBatteryCell', () => {
    it('returns false for invalid or empty inputs', () => {
      expect(matchesBatteryCell(null as any, '4S')).toBe(false)
      expect(matchesBatteryCell({}, '')).toBe(false)
      expect(matchesBatteryCell({ name: 'Drone' }, '99S')).toBe(false)
    })

    it('matches directly via product.cells or product.celdas', () => {
      expect(matchesBatteryCell({ cells: 1 }, '1S')).toBe(true)
      expect(matchesBatteryCell({ celdas: '4S' }, '4S')).toBe(true)
      expect(matchesBatteryCell({ batteryCells: 6 }, '6S')).toBe(true)
      expect(matchesBatteryCell({ cells: 4 }, '6S')).toBe(false)
    })

    it('matches cell counts in product names with boundary checks', () => {
      const battery1S = { name: 'Emax 1S-450mAh LiPo 3.8V' }
      const battery2S = { name: 'BetaFPV 2PCS-2S-300mAh' }
      const battery3S = { name: 'iFlight 3S-450mAh 75C' }
      const battery4S = { name: 'GEPRC 4S-650a850mAh LiPo' }
      const battery6S = { name: 'Tattu R-Line Version 5.0 6S 1400mAh 150C' }
      const battery12S = { name: 'GNB 12S 5000mAh 44.4V High Voltage' }

      expect(matchesBatteryCell(battery1S, '1S')).toBe(true)
      expect(matchesBatteryCell(battery2S, '2S')).toBe(true)
      expect(matchesBatteryCell(battery3S, '3S')).toBe(true)
      expect(matchesBatteryCell(battery4S, '4S')).toBe(true)
      expect(matchesBatteryCell(battery6S, '6S')).toBe(true)
      expect(matchesBatteryCell(battery12S, '12S')).toBe(true)

      // Cross-checks
      expect(matchesBatteryCell(battery1S, '4S')).toBe(false)
      expect(matchesBatteryCell(battery4S, '6S')).toBe(false)
    })

    it('does not false-match model numbers containing S (e.g. E520S does not match 2S)', () => {
      const droneE520S = { name: 'Eachine E520S-1200mAh Drone Battery' }
      expect(matchesBatteryCell(droneE520S, '2S')).toBe(false)
    })

    it('matches via nominal voltage patterns (e.g. 22.2V -> 6S, 14.8V -> 4S)', () => {
      const batteryByVolt6S = { description: 'Voltaje nominal de 22.2V para máxima potencia' }
      const batteryByVolt4S = { specifications: 'Voltage: 14.8V (4S)' }

      expect(matchesBatteryCell(batteryByVolt6S, '6S')).toBe(true)
      expect(matchesBatteryCell(batteryByVolt4S, '4S')).toBe(true)
    })

    it('matches "X celdas" wording in description or specifications', () => {
      const batteryCeldas = { description: 'Batería compacta de 2 celdas para micro whoops' }
      expect(matchesBatteryCell(batteryCeldas, '2S')).toBe(true)
      expect(matchesBatteryCell(batteryCeldas, '4S')).toBe(false)
    })
  })

  describe('getBatteryCellCounts', () => {
    it('accurately calculates item counts per cell type from an array of products', () => {
      const products = [
        { name: '1S-300mAh' },
        { name: '1S-450mAh' },
        { name: '2S-300mAh' },
        { name: '4S-650mAh' },
        { name: '4S-850mAh' },
        { name: '6S-1400mAh' },
        { name: '12S-5000mAh' },
        { name: 'Generic prop tools' } // No cell match
      ]

      const counts = getBatteryCellCounts(products)
      expect(counts['1S']).toBe(2)
      expect(counts['2S']).toBe(1)
      expect(counts['3S']).toBe(0)
      expect(counts['4S']).toBe(2)
      expect(counts['5S']).toBe(0)
      expect(counts['6S']).toBe(1)
      expect(counts['12S']).toBe(1)
    })
  })
})
