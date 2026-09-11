"use client";

import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { FEATURED_BRANDS } from "@/utilities/brandsConfig";

/**
 * Modernized interactive brand showcase for Wavi Aeronautics.
 * Features:
 * - Background normalization via uniform card containers + mix-blend-multiply
 * - Responsive 8-column grid (2 on mobile, 4 on tablet, 8 on desktop)
 * - Hardware-accelerated hover zoom (scale-108) and grayscale-to-color transition
 * - Dynamic Wavi cyan elevation glow
 * - Direct navigation to filtered catalog route (/tienda?marca=[slug])
 */
export function FeaturedBrands({ brands = FEATURED_BRANDS }) {
  return (
    <Box
      component="section"
      aria-label="Marcas destacadas de Wavi Aeronautics"
      sx={{
        py: { xs: 6, sm: 8, md: 9 },
        position: "relative",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      {/* Decorative high-tech ambient background glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "260px",
          background:
            "radial-gradient(ellipse at center, rgba(0, 172, 228, 0.08) 0%, rgba(0, 172, 228, 0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3, md: 4 } }}
      >
        {/* Header & Badging */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 6 } }}>
          <Chip
            icon={
              <VerifiedIcon
                sx={{
                  fontSize: "15px !important",
                  color: "#00aCe4 !important",
                }}
              />
            }
            label="PARTNERS OFICIALES & HARDWARE DE ÉLITE"
            size="small"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              backgroundColor: "rgba(0, 172, 228, 0.08)",
              color: "#0284c7",
              border: "1px solid rgba(0, 172, 228, 0.25)",
              px: 1,
            }}
          />

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              letterSpacing: "-0.02em",
              color: "#0f172a",
              mb: 1.5,
              textTransform: "none",
            }}
          >
            Marcas Destacadas
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 640,
              mx: "auto",
              color: "#64748b",
              fontSize: { xs: "0.92rem", sm: "1.02rem" },
              lineHeight: 1.6,
            }}
          >
            Distribución y venta de componentes de alta gama para pilotos FPV,
            cinemática profesional y sistemas autónomos VToL.
          </Typography>
        </Box>

        {/* Responsive Grid: grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 px-4 */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(8, minmax(0, 1fr))",
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            alignItems: "stretch",
          }}
        >
          {brands.map((brand) => (
            <Box
              key={brand.id}
              component={Link}
              href={`/tienda?marca=${brand.slug}`}
              aria-label={`Ver productos de la marca ${brand.name}`}
              data-testid={`brand-card-${brand.slug}`}
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, sm: 2.5 },
                minHeight: { xs: 110, sm: 120, md: 130 },
                backgroundColor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(8px)",
                borderRadius: "14px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow:
                  "0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)",
                textDecoration: "none",
                overflow: "hidden",
                cursor: "pointer",
                willChange: "transform, filter, box-shadow, border-color",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  transform: "scale(1.08)",
                  backgroundColor: "#ffffff",
                  borderColor: "rgba(0, 172, 228, 0.45)",
                  boxShadow:
                    "0 12px 28px -6px rgba(0, 172, 228, 0.22), 0 4px 12px -2px rgba(0, 172, 228, 0.12)",
                  "& .brand-logo-img": {
                    filter: "grayscale(0%) opacity(1)",
                    transform: "scale(1.02)",
                  },
                  "& .brand-arrow-hint": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
                "&:focus-visible": {
                  outline: "2px solid #00aCe4",
                  outlineOffset: "3px",
                },
              }}
            >
              {/* Brand Logo Container with Normalization & Multiply Blending */}
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  className="brand-logo-img"
                  src={brand.logoUrl}
                  alt={`Logo de ${brand.name}`}
                  loading="lazy"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: { xs: "42px", sm: "46px", md: "50px" },
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    filter: "grayscale(100%) opacity(0.72)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, filter",
                  }}
                />
              </Box>

              {/* Sub-label for brand identity and screen readers */}
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#94a3b8",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  transition: "color 0.25s ease",
                  ".MuiBox-root:hover &": {
                    color: "#0284c7",
                  },
                }}
              >
                {brand.name}
              </Typography>

              {/* Micro-indicator arrow on hover */}
              <Box
                className="brand-arrow-hint"
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: 8,
                  opacity: 0,
                  transform: "translateY(4px)",
                  transition: "all 0.25s ease",
                  color: "#00aCe4",
                  display: { xs: "none", md: "flex" },
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: "13px" }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturedBrands;
