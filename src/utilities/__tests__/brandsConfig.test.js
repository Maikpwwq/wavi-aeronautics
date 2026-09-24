import { describe, it, expect } from 'vitest'
import {
  FEATURED_BRANDS,
  STORE_BRANDS,
  cleanBrandString,
  getBrandAliases,
  matchesBrand,
} from '@/utilities/brandsConfig'

describe('brandsConfig Utility Tests', () => {
  it('contains expected featured brands including TBS, RadioMaster, BetaFPV', () => {
    const brandIds = FEATURED_BRANDS.map((b) => b.id)
    expect(brandIds).toContain('tbs')
    expect(brandIds).toContain('radiomaster')
    expect(brandIds).toContain('betafpv')
    expect(brandIds).toContain('geprc')
  })

  it('contains all 17 verified catalog store brands in STORE_BRANDS', () => {
    const storeBrandIds = STORE_BRANDS.map((b) => b.id)
    const expected = [
      'betafpv', 'caddx', 'dji', 'eachine', 'emax', 'ethix',
      'fatshark', 'flysky', 'flywoo', 'frsky', 'geprc',
      'iflight', 'radiomaster', 'tbs', 'tinyhawk', 'uruav', 'walksnail'
    ]
    expected.forEach((brand) => {
      expect(storeBrandIds).toContain(brand)
    })
    expect(STORE_BRANDS.length).toBe(17)
  })

  describe('cleanBrandString', () => {
    it('normalizes casing and removes dashes, underscores and whitespace', () => {
      expect(cleanBrandString('Team-BlackSheep')).toBe('teamblacksheep')
      expect(cleanBrandString('  Radio_Master  ')).toBe('radiomaster')
      expect(cleanBrandString('Beta FPV')).toBe('betafpv')
      expect(cleanBrandString(null)).toBe('')
      expect(cleanBrandString(undefined)).toBe('')
    })
  })

  describe('getBrandAliases', () => {
    it('returns brand aliases for TBS / Team BlackSheep', () => {
      const aliases = getBrandAliases('tbs')
      expect(aliases).toContain('tbs')
      expect(aliases).toContain('team-blacksheep')
      expect(aliases).toContain('team blacksheep')

      const aliasesFromFull = getBrandAliases('Team BlackSheep')
      expect(aliasesFromFull).toContain('tbs')
      expect(aliasesFromFull).toContain('team-blacksheep')
    })

    it('returns brand aliases for RadioMaster / radio-master', () => {
      const aliases = getBrandAliases('radiomaster')
      expect(aliases).toContain('radiomaster')
      expect(aliases).toContain('radio-master')
    })

    it('handles unknown brands gracefully', () => {
      const aliases = getBrandAliases('CustomBrand')
      expect(aliases).toContain('custombrand')
    })
  })

  describe('matchesBrand', () => {
    it('matches TBS with team-blacksheep in either direction', () => {
      expect(matchesBrand('team-blacksheep', 'tbs')).toBe(true)
      expect(matchesBrand('Team BlackSheep', 'tbs')).toBe(true)
      expect(matchesBrand('tbs', 'team-blacksheep')).toBe(true)
      expect(matchesBrand('TEAM BLACKSHEEP', 'TBS')).toBe(true)
    })

    it('matches RadioMaster with radio-master', () => {
      expect(matchesBrand('radio-master', 'radiomaster')).toBe(true)
      expect(matchesBrand('RadioMaster', 'radio-master')).toBe(true)
    })

    it('matches iFlight with iflight-rc', () => {
      expect(matchesBrand('iflight-rc', 'iflight')).toBe(true)
      expect(matchesBrand('iFlight', 'iflight-rc')).toBe(true)
    })

    it('returns false for unrelated brands', () => {
      expect(matchesBrand('betafpv', 'tbs')).toBe(false)
      expect(matchesBrand('geprc', 'radiomaster')).toBe(false)
      expect(matchesBrand(null, 'tbs')).toBe(false)
      expect(matchesBrand('tbs', null)).toBe(false)
    })
  })
})
