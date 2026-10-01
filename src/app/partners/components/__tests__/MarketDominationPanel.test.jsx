import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MarketDominationPanel from '../MarketDominationPanel'

describe('MarketDominationPanel Component Tests', () => {
  it('renders Section 1: El Vacío Técnico with market thesis and competitor audit', () => {
    render(<MarketDominationPanel />)

    // Section 1 header
    expect(screen.getByText(/1\. El Vacío Técnico \(Contexto del Mercado\)/i)).toBeInTheDocument()

    // Proposed market thesis quote
    expect(
      screen.getByText(/El mercado FPV en Colombia no está saturado; está digitalmente abandonado/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/JuandaStoreRC, jjtronicshop/i)).toBeInTheDocument()
    expect(screen.getByText(/entra a monopolizar un vacío técnico capturando el tráfico huérfano/i)).toBeInTheDocument()

    // Competitor cards
    expect(screen.getByText('JuandaStoreRC')).toBeInTheDocument()
    expect(screen.getByText('JJTronicShop')).toBeInTheDocument()
    expect(screen.getAllByText('Wavi Aeronautics').length).toBeGreaterThan(0)
  })

  it('renders Section 2: La Asimetría del CAC comparing traditional paid vs organic infrastructure', () => {
    render(<MarketDominationPanel />)

    // Section 2 header
    expect(screen.getByText(/2\. La Asimetría del CAC/i)).toBeInTheDocument()

    // CAC comparison figures
    expect(screen.getByText(/\$38\.50 USD/i)).toBeInTheDocument()
    expect(screen.getByText(/\$0\.00 USD \(Inorgánico Cero\)/i)).toBeInTheDocument()
    expect(screen.getByText(/68% \(Consumibles Express\)/i)).toBeInTheDocument()
  })

  it('updates the central argument highlight dynamically when switching sponsorship tiers', () => {
    const handleSelectTier = vi.fn()
    render(<MarketDominationPanel onSelectTier={handleSelectTier} />)

    // Default is $5,000 USD tier
    expect(screen.getAllByText(/\$5,000 USD/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/\+120,000 impresiones directas/i)).toBeInTheDocument()
    expect(screen.getByText(/312%/i)).toBeInTheDocument()

    // Switch to $2,500 USD tier
    const tier2500Btn = screen.getByRole('button', { name: '$2,500 USD' })
    fireEvent.click(tier2500Btn)

    expect(handleSelectTier).toHaveBeenCalledWith(
      expect.objectContaining({
        investmentAmountUsd: 2500,
        targetedImpressions: 55000,
        projectedAnnualRoiPercent: 260
      })
    )
    expect(screen.getByText(/\+55,000 impresiones directas/i)).toBeInTheDocument()
    expect(screen.getByText(/260%/i)).toBeInTheDocument()

    // Switch to $10,000 USD tier
    const tier10000Btn = screen.getByRole('button', { name: '$10,000 USD' })
    fireEvent.click(tier10000Btn)

    expect(screen.getByText(/\+260,000 impresiones directas/i)).toBeInTheDocument()
    expect(screen.getByText(/348%/i)).toBeInTheDocument()
  })

  it('renders Section 3: El Mecanismo de Retorno with 0% equity policy and Target Inventory', () => {
    render(<MarketDominationPanel />)

    // Section 3 header & 0% equity badge
    expect(screen.getByText(/3\. El Mecanismo de Retorno \(Cero Equity/i)).toBeInTheDocument()
    expect(screen.getByText('0% DILUCIÓN ACCIONARIA')).toBeInTheDocument()

    // Target Inventory: RadioMaster ER series, LiPo batteries, EX5 twin-blade individual repositions
    expect(screen.getByText(/Receptores RadioMaster Serie ER \(ELRS\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Baterías LiPo Alta Tasa de Descarga/i)).toBeInTheDocument()
    expect(screen.getByText(/Reposición de Palas Individuales EX5 \(Twin-Blade\)/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Configuración técnica de dos palas independientes por rotor para plataformas cinemáticas tipo EX5/i)
    ).toBeInTheDocument()

    // Contract conditions
    expect(screen.getByText(/Inyección de Capital:/i)).toBeInTheDocument()
    expect(screen.getByText(/Aporte Operativo Wavi:/i)).toBeInTheDocument()
    expect(screen.getByText(/Retorno Waterfall Fijo:/i)).toBeInTheDocument()
    expect(screen.getByText(/Cero Intromisión Accionaria:/i)).toBeInTheDocument()
  })

  it('filters Target Inventory items by category tab', () => {
    render(<MarketDominationPanel />)

    // Filter to Receptores ER only
    const receiversTab = screen.getByRole('button', { name: 'Receptores ER' })
    fireEvent.click(receiversTab)

    expect(screen.getByText(/Receptores RadioMaster Serie ER \(ELRS\)/i)).toBeInTheDocument()
    expect(screen.queryByText(/Baterías LiPo Alta Tasa de Descarga/i)).not.toBeInTheDocument()

    // Filter to Palas EX5
    const bladesTab = screen.getByRole('button', { name: 'Palas EX5' })
    fireEvent.click(bladesTab)

    expect(screen.getByText(/Reposición de Palas Individuales EX5/i)).toBeInTheDocument()
    expect(screen.queryByText(/Receptores RadioMaster Serie ER/i)).not.toBeInTheDocument()

    // Return to Todos
    const allTab = screen.getByRole('button', { name: 'Todos' })
    fireEvent.click(allTab)

    expect(screen.getByText(/Receptores RadioMaster Serie ER/i)).toBeInTheDocument()
    expect(screen.getByText(/Baterías LiPo Alta Tasa de Descarga/i)).toBeInTheDocument()
  })

  it('triggers onInitiateDeal callback when clicking Solicitar Term Sheet button', () => {
    const handleInitiateDeal = vi.fn()
    render(<MarketDominationPanel onInitiateDeal={handleInitiateDeal} />)

    const dealBtn = screen.getByRole('button', { name: /Solicitar Term Sheet/i })
    fireEvent.click(dealBtn)

    expect(handleInitiateDeal).toHaveBeenCalledTimes(1)
    expect(handleInitiateDeal).toHaveBeenCalledWith(
      expect.objectContaining({
        tier: expect.objectContaining({
          investmentAmountUsd: 5000,
          projectedAnnualRoiPercent: 312
        })
      })
    )
  })
})
