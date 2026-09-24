'use client'

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import {
  LinkOutlined,
  WhatsApp,
  Facebook,
  EmailOutlined,
  ShareOutlined
} from '@mui/icons-material'

/**
 * ProductShareSuite Component
 * Renders a row of circular social share buttons for the PDP.
 * Supports: Copy Link, WhatsApp, Facebook, Email, and native Web Share API.
 */
const ProductShareSuite = ({ productName = '', productUrl }) => {
  const [copied, setCopied] = useState(false)
  const [supportsNativeShare, setSupportsNativeShare] = useState(false)

  useEffect(() => {
    setSupportsNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const getUrl = () => productUrl || (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = getUrl()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
    }
  }

  const handleWhatsApp = () => {
    const text = `Mira este producto: ${productName} — ${getUrl()}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`, '_blank')
  }

  const handleEmail = () => {
    const subject = `Te comparto este producto: ${productName}`
    const body = `Mira este producto en Wavi Aeronautics:\n\n${productName}\n${getUrl()}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: productName,
        text: `Mira este producto: ${productName}`,
        url: getUrl()
      })
    } catch {
      // User cancelled or share failed silently
    }
  }

  const iconButtonSx = {
    width: 36,
    height: 36,
    border: '1px solid #e2e8f0',
    color: '#64748b',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#00aCe4',
      color: '#00aCe4',
      bgcolor: 'rgba(0, 172, 228, 0.06)'
    }
  }

  return (
    <>
      <Box
        data-testid="product-share-suite"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center'
        }}
      >
        <Tooltip title="Copiar enlace" arrow>
          <IconButton
            aria-label="Copiar enlace del producto"
            onClick={handleCopyLink}
            size="small"
            sx={iconButtonSx}
          >
            <LinkOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Compartir en WhatsApp" arrow>
          <IconButton
            aria-label="Compartir en WhatsApp"
            onClick={handleWhatsApp}
            size="small"
            sx={iconButtonSx}
          >
            <WhatsApp fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Compartir en Facebook" arrow>
          <IconButton
            aria-label="Compartir en Facebook"
            onClick={handleFacebook}
            size="small"
            sx={iconButtonSx}
          >
            <Facebook fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Enviar por correo" arrow>
          <IconButton
            aria-label="Enviar por correo electrónico"
            onClick={handleEmail}
            size="small"
            sx={iconButtonSx}
          >
            <EmailOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        {supportsNativeShare && (
          <Tooltip title="Compartir" arrow>
            <IconButton
              aria-label="Compartir usando opciones del dispositivo"
              onClick={handleNativeShare}
              size="small"
              sx={iconButtonSx}
            >
              <ShareOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Copy confirmation toast */}
      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="success"
          variant="filled"
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          ¡Enlace copiado al portapapeles!
        </Alert>
      </Snackbar>
    </>
  )
}

ProductShareSuite.propTypes = {
  productName: PropTypes.string,
  productUrl: PropTypes.string
}

export { ProductShareSuite }
export default ProductShareSuite
