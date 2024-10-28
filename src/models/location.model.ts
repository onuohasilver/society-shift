import { Schema, model, Document } from 'mongoose'
import {
  Location,
  GovernmentType,
  StabilityLevel,
  CorruptionLevel,
  WorkforceSkillLevel,
  SocialUnrestLevel,
  PoliticalEventFrequency,
  ConsumerWealthLevel,
  InfrastructureLevel,
  AccessibilityLevel,
  CrimeLevel,
} from '../types/locations/location.type'

export interface LocationDocument extends Location, Document {}

const locationSchema = new Schema<LocationDocument>(
  {
    name: { type: String, required: true },
    governmentType: {
      type: String,
      required: true,
      enum: Object.keys(GovernmentType),
    },
    economicFactors: {
      baseCurrency: { type: String, required: true },
      economicStability: {
        type: String,
        required: true,
        enum: Object.keys(StabilityLevel),
      },
      marketDemand: { type: Map, of: Number, required: true },
      taxRate: { type: Number, required: true },
    },
    legalEnvironment: {
      businessRegulations: [{ type: String }],
      corruptionLevel: {
        type: String,
        required: true,
        enum: Object.keys(CorruptionLevel),
      },
      blackMarketPresence: { type: Boolean, required: true },
    },
    culturalFactors: {
      workforceSkillLevel: {
        type: String,
        required: true,
        enum: Object.keys(WorkforceSkillLevel),
      },
      culturalPreferences: { type: Map, of: Number, required: true },
      socialUnrest: {
        type: String,
        required: true,
        enum: Object.keys(SocialUnrestLevel),
      },
    },
    geopoliticalFactors: {
      tradeRelationships: [{ type: String }],
      politicalEventsFrequency: {
        type: String,
        required: true,
        enum: Object.keys(PoliticalEventFrequency),
      },
      regionalAlliances: [{ type: String }],
    },
    naturalResources: {
      resources: [{ type: String }],
      resourceAbundance: { type: Map, of: Number, required: true },
    },
    marketSize: {
      population: { type: Number, required: true },
      consumerWealth: {
        type: String,
        required: true,
        enum: Object.keys(ConsumerWealthLevel),
      },
      ageDemographics: { type: Map, of: Number, required: true },
    },
    technologicalDevelopment: {
      infrastructureLevel: {
        type: String,
        required: true,
        enum: Object.keys(InfrastructureLevel),
      },
      internetAccessibility: {
        type: String,
        required: true,
        enum: Object.keys(AccessibilityLevel),
      },
    },
    security: {
      crimeRate: {
        type: String,
        required: true,
        enum: Object.keys(CrimeLevel),
      },
      securityCosts: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
    strict: true,
  }
)

export default model<LocationDocument>('Location', locationSchema)
