import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PartnersPage from '../page'

describe('PartnersPage B2B Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve())
      }
    })
  })

  it('renders the main hero headline and value proposition', () => {
    render(<PartnersPage />)

    expect(screen.getByText(/Unlock the Colombian FPV Market/i)).toBeInTheDocument()
    expect(screen.getByText(/Zero Friction. Zero Initial MOQ/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Wavi Aeronautics is the authorized logistics, regulatory, and technical distribution bridge/i)
    ).toBeInTheDocument()
  })

  it('renders all key market metrics in the trust banner', () => {
    render(<PartnersPage />)

    expect(screen.getByText('52M+')).toBeInTheDocument()
    expect(screen.getByText('0 MOQ')).toBeInTheDocument()
    expect(screen.getByText('24-72h')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders all 4 friction points detailing why global brands lose market share', () => {
    render(<PartnersPage />)

    expect(screen.getByText(/DIAN Customs Holds & 32% Cart Abandonment/i)).toBeInTheDocument()
    expect(screen.getByText(/The 20-Day Shipping Barrier for Consumables/i)).toBeInTheDocument()
    expect(screen.getByText(/Payment Gateway & Foreign Exchange Failures/i)).toBeInTheDocument()
    expect(screen.getByText(/Civil Aviation Regulatory Hesitation/i)).toBeInTheDocument()
  })

  it('renders infrastructure section with mock code window showing orderPayload', () => {
    render(<PartnersPage />)

    expect(screen.getByText(/Engineered for High-Speed Hardware Distribution/i)).toBeInTheDocument()
    expect(screen.getByText(/API & Webhook Inventory Routing/i)).toBeInTheDocument()
    expect(screen.getByText(/Two-Tier Hybrid Fulfillment Engine/i)).toBeInTheDocument()
    expect(screen.getByText(/Certified UAS Pilot Support in Spanish/i)).toBeInTheDocument()

    // Subliminal code snippet presence
    expect(screen.getByText(/orderPayload/)).toBeInTheDocument()
    expect(screen.getByText(/WaviCore\.dispatchOrder/)).toBeInTheDocument()
  })

  it('switches tabs in the code terminal between payload and webhook', () => {
    render(<PartnersPage />)

    const webhookTab = screen.getByRole('button', { name: 'webhook-event.json' })
    fireEvent.click(webhookTab)

    expect(screen.getByText(/factory\.order\.dispatched/)).toBeInTheDocument()
    expect(screen.getByText(/FEDEX_AERO_PRIORITY/)).toBeInTheDocument()

    const payloadTab = screen.getByRole('button', { name: 'order-dispatch.ts' })
    fireEvent.click(payloadTab)

    expect(screen.getByText(/orderPayload/)).toBeInTheDocument()
  })

  it('copies code snippet to clipboard on click', async () => {
    render(<PartnersPage />)

    const copyBtn = screen.getByLabelText('Copy sample integration payload')
    await React.act(async () => {
      fireEvent.click(copyBtn)
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })

  it('renders the 3 commercial partnership models', () => {
    render(<PartnersPage />)

    expect(screen.getByText('Tier 1 B2B Dropship Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Strategic Demo Sponsorship & Brand Authority')).toBeInTheDocument()
    expect(screen.getByText('Consumable Micro-Stocking Depot')).toBeInTheDocument()

    expect(screen.getByText(/Zero initial Minimum Order Quantity \(MOQ\) to launch/i)).toBeInTheDocument()
    expect(screen.getByText(/Buffer inventory of props, antennas, ELRS receivers, and LiPo batteries/i)).toBeInTheDocument()
  })

  it('opens B2B partner intake dialog and handles form input', async () => {
    render(<PartnersPage />)

    const openBtns = screen.getAllByRole('button', { name: /Connect with Director|Initiate Brand Partnership/i })
    fireEvent.click(openBtns[0])

    expect(screen.getByText('B2B Partner Intake & Alignment')).toBeInTheDocument()

    const brandInput = screen.getByLabelText(/Brand \/ Manufacturer Name/i)
    fireEvent.change(brandInput, { target: { value: 'GEPRC Global' } })
    expect(brandInput.value).toBe('GEPRC Global')

    const contactInput = screen.getByLabelText(/Contact Person & Title/i)
    fireEvent.change(contactInput, { target: { value: 'Alex Zhang' } })
    expect(contactInput.value).toBe('Alex Zhang')

    const emailInput = screen.getByLabelText(/Official Business Email/i)
    fireEvent.change(emailInput, { target: { value: 'alex@geprc.com' } })
    expect(emailInput.value).toBe('alex@geprc.com')

    const closeBtn = screen.getByLabelText('Close dialog')
    fireEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('B2B Partner Intake & Alignment')).not.toBeInTheDocument()
    })
  })
})
