/**
 * TypeScript Data Models for Market Domination & CAC Asymmetry Visualizations
 * Wavi Aeronautics B2B Deal Architecture
 */

export type InfrastructureType = 'legacy_storefront' | 'paid_ad_dependent' | 'wavi_technical_moat';

export interface CompetitorTrafficProfile {
  name: string;
  type: InfrastructureType;
  costPerClickUsd: number;
  estimatedMonthlyAdSpendUsd: number;
  conversionRate: number; // percentage (e.g. 1.2%)
  infrastructureAudit: string;
  cartAbandonmentRate: number; // percentage (e.g. 74%)
}

export interface WaviAcquisitionMoat {
  organicSearchVolumeMonthly: number;
  cacPerAcquiredPilotUsd: number; // $0.00
  organicTrafficShare: number; // percentage (e.g. 84%)
  retentionRate90Days: number; // percentage
  dianFrictionAbsorption: boolean;
  technicalMoatDescription: string;
}

export interface CacComparisonModel {
  channelName: string;
  costPerClick: number;
  cacPerCustomer: number;
  averageOrderValue: number;
  paybackPeriodDays: number;
  sustainabilityScore: number; // 0 - 100
  colorAccent: string;
}

export interface TargetInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'receivers' | 'lipo_batteries' | 'individual_rotor_blades' | 'bnf_hardware';
  technicalSpecification: string;
  rotationVelocityDays: number;
  grossMarginPercent: number;
  unitCostUsd: number;
  marketDemandTier: 'CRITICAL_DAILY_ROTATION' | 'HIGH_ACCIDENT_REPLACEMENT' | 'SCHEDULED_UPGRADE';
}

export interface SponsorshipTier {
  id: string;
  investmentAmountUsd: number;
  targetedImpressions: number;
  projectedAnnualRoiPercent: number;
  monthlyInventoryTurns: number;
  capitalRecoveryPeriodMonths: number;
  recommendedInventoryMix: string;
}

export interface ReturnMechanismContract {
  equityDilutionPercent: number; // strictly 0%
  controlRetentionPercent: number; // strictly 100%
  capitalRepaymentStructure: string;
  fixedYieldPerTransactionPercent: number;
  liquidationHurdleRatePercent: number;
  inventoryAllocationMandate: string;
}
