import { describe, it, expect } from 'vitest'
import { matchesVtxSystem, normalizeText } from '../vtxConfig'
import { VTX_SYSTEM_OPTIONS } from '@/types/filter'

describe('vtxConfig & VTX Matching Logic', () => {
  describe('normalizeText', () => {
    it('normalizes accents, diacritics and converts to lowercase', () => {
      expect(normalizeText('Analógico')).toBe('analogico')
      expect(normalizeText('CÁDDX FPV')).toBe('caddx fpv')
      expect(normalizeText('')).toBe('')
      expect(normalizeText(null)).toBe('')
      expect(normalizeText(undefined)).toBe('')
    })
  })

  describe('matchesVtxSystem', () => {
    it('returns false for empty product or empty vtxId', () => {
      expect(matchesVtxSystem(null as any, 'o3')).toBe(false)
      expect(matchesVtxSystem({}, '')).toBe(false)
      expect(matchesVtxSystem({ name: 'Drone' }, 'invalid_vtx')).toBe(false)
    })

    it('matches directly via explicit product.vtx or product.vtxSystem property', () => {
      expect(matchesVtxSystem({ vtx: 'o3' }, 'o3')).toBe(true)
      expect(matchesVtxSystem({ vtxSystem: 'walksnail' }, 'walksnail')).toBe(true)
      expect(matchesVtxSystem({ sistemaVtx: 'analogico' }, 'analogico')).toBe(true)
    })

    it('matches WTFPV system from name, description, or specs', () => {
      const drone = {
        name: 'Mobula6 HDZero / WTFPV Edition',
        description: 'Micro whoop digital compatible con WTFPV y MSP-OSD.',
      }
      expect(matchesVtxSystem(drone, 'wtfpv')).toBe(true)
      expect(matchesVtxSystem(drone, 'o3')).toBe(false)
    })

    it('matches Analógico system from spanish accented or english text', () => {
      const drone1 = { name: 'BetaFPV Meteor75 Pro Analógico 1S Whoop' }
      const drone2 = { description: 'Equipado con cámara RunCam Nano 3 y VTX Analog 350mW' }
      expect(matchesVtxSystem(drone1, 'analogico')).toBe(true)
      expect(matchesVtxSystem(drone2, 'analogico')).toBe(true)
      expect(matchesVtxSystem(drone1, 'o3')).toBe(false)
    })

    it('matches DJI O3 with boundary check (preventing false positive substring matches)', () => {
      const droneO3 = { name: 'GEPRC CineLog35 V2 HD DJI O3 Cinewhoop' }
      const droneO3Short = { name: 'GEPRC DarkStar20 HD O3' }
      const unrelated = { name: 'Bo3ing 747 RC Model' }

      expect(matchesVtxSystem(droneO3, 'o3')).toBe(true)
      expect(matchesVtxSystem(droneO3Short, 'o3')).toBe(true)
      expect(matchesVtxSystem(unrelated, 'o3')).toBe(false)
    })

    it('matches DJI O4 system with boundary check', () => {
      const droneO4 = { name: 'Pavo20 Pro HD O4 Air Unit' }
      const unrelated = { name: 'Pro4 Drone Kit' }

      expect(matchesVtxSystem(droneO4, 'o4')).toBe(true)
      expect(matchesVtxSystem(unrelated, 'o4')).toBe(false)
    })

    it('matches WASP (RunCam Link / Caddx Vista)', () => {
      const droneWasp = { name: 'GEPRC Thinking P16 HD WASP' }
      const droneVista = { description: 'Transmisor Caddx Vista con cámara RunCam Wasp' }
      const droneLink = { specifications: 'RunCam Link HD Digital System' }

      expect(matchesVtxSystem(droneWasp, 'wasp')).toBe(true)
      expect(matchesVtxSystem(droneVista, 'wasp')).toBe(true)
      expect(matchesVtxSystem(droneLink, 'wasp')).toBe(true)
      expect(matchesVtxSystem(droneWasp, 'wtfpv')).toBe(false)
    })

    it('matches Walksnail Avatar (CaddxFPV)', () => {
      const droneAvatar = { name: 'BetaFPV Pavo20 Walksnail Avatar HD' }
      const droneCaddx = { description: 'Sistema de video digital CaddxFPV Avatar 1S' }

      expect(matchesVtxSystem(droneAvatar, 'walksnail')).toBe(true)
      expect(matchesVtxSystem(droneCaddx, 'walksnail')).toBe(true)
      expect(matchesVtxSystem(droneAvatar, 'o3')).toBe(false)
    })

    it('matches VTX options defined inside product.variationGroups', () => {
      const productWithVariations = {
        name: 'Cinewhoop BNF 3.5"',
        variationGroups: [
          {
            name: 'Sistema VTX',
            options: [
              { label: 'DJI O3 Air Unit' },
              { label: 'Walksnail Avatar' }
            ]
          }
        ]
      }

      expect(matchesVtxSystem(productWithVariations, 'o3')).toBe(true)
      expect(matchesVtxSystem(productWithVariations, 'walksnail')).toBe(true)
      expect(matchesVtxSystem(productWithVariations, 'wtfpv')).toBe(false)
    })
  })

  describe('VTX_SYSTEM_OPTIONS definition', () => {
    it('contains all 6 required VTX systems with canonical labels and ids', () => {
      const ids = VTX_SYSTEM_OPTIONS.map((opt) => opt.id)
      expect(ids).toContain('wtfpv')
      expect(ids).toContain('analogico')
      expect(ids).toContain('o3')
      expect(ids).toContain('o4')
      expect(ids).toContain('wasp')
      expect(ids).toContain('walksnail')

      const labels = VTX_SYSTEM_OPTIONS.map((opt) => opt.label)
      expect(labels).toContain('WTFPV')
      expect(labels).toContain('Analógico')
      expect(labels).toContain('O3')
      expect(labels).toContain('O4')
      expect(labels).toContain('WASP (RunCam)')
      expect(labels).toContain('Walksnail Avatar (CaddxFPV)')
    })
  })
})
