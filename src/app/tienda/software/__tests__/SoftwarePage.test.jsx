import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SoftwarePage from '../page'

describe('SoftwarePage Component Tests', () => {
  it('renders standardized hero title and eyebrow badge', () => {
    render(<SoftwarePage />)

    expect(screen.getByText('Ecosistema Digital & Software')).toBeInTheDocument()
    expect(screen.getByText('Software Especializado para Drones & FPV')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Software Especializado para Drones & FPV')
  })

  it('renders VelociDrone simulator card with feature checklist and outbound link', () => {
    render(<SoftwarePage />)

    expect(screen.getByText('VelociDrone FPV')).toBeInTheDocument()
    expect(screen.getByText(/Simulador de Carreras y Freestyle/i)).toBeInTheDocument()
    expect(screen.getByText(/Física aerodinámica hiperrealista/i)).toBeInTheDocument()

    const velocidroneBtn = screen.getByRole('link', { name: /Adquirir licencia VelociDrone/i })
    expect(velocidroneBtn).toBeInTheDocument()
    expect(velocidroneBtn).toHaveAttribute('href', 'https://www.velocidrone.com/')
    expect(velocidroneBtn).toHaveAttribute('target', '_blank')
    expect(velocidroneBtn).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('renders Pix4D photogrammetry card with feature checklist and outbound link', () => {
    render(<SoftwarePage />)

    expect(screen.getByText('Pix4D Digital Mapping')).toBeInTheDocument()
    expect(screen.getByText(/Fotogrametría y Topografía 3D con Drones/i)).toBeInTheDocument()
    expect(screen.getByText(/Generación de ortomosaicos georreferenciados/i)).toBeInTheDocument()

    const pix4dBtn = screen.getByRole('link', { name: /Adquirir licencia Pix4D/i })
    expect(pix4dBtn).toBeInTheDocument()
    expect(pix4dBtn).toHaveAttribute('href', 'https://www.pix4d.com/es')
    expect(pix4dBtn).toHaveAttribute('target', '_blank')
    expect(pix4dBtn).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('renders free configuration and firmware utility cards', () => {
    render(<SoftwarePage />)

    expect(screen.getByText('Betaflight Configurator')).toBeInTheDocument()
    expect(screen.getByText('EdgeTX Companion')).toBeInTheDocument()
    expect(screen.getByText('ESC Configurator')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /Descargar Betaflight/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Descargar EdgeTX/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Abrir ESC Configurator/i })).toBeInTheDocument()
  })

  it('renders WhatsApp technical advisory CTA banner', () => {
    render(<SoftwarePage />)

    expect(screen.getByText(/¿Dudas sobre licencias o configuración de tu control\?/i)).toBeInTheDocument()
    const whatsappBtn = screen.getByRole('link', { name: /Consultar por WhatsApp/i })
    expect(whatsappBtn).toBeInTheDocument()
    expect(whatsappBtn).toHaveAttribute('href', expect.stringContaining('wa.me/573245464166'))
  })
})
