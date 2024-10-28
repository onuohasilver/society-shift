import { ValidationSchema } from '../middleware/validate.request'
import {
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

export const createLocationSchema: ValidationSchema = {
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  governmentType: {
    type: 'string',
    required: true,
    enum: Object.values(GovernmentType),
  },
  economicFactors: {
    type: 'object',
    required: true,
    properties: {
      baseCurrency: {
        type: 'string',
        required: true,
      },
      economicStability: {
        type: 'string',
        required: true,
        enum: Object.values(StabilityLevel),
      },
      marketDemand: {
        type: 'object',
        required: true,
      },
      taxRate: {
        type: 'number',
        required: true,
        min: 0,
        max: 100,
      },
    },
  },
  legalEnvironment: {
    type: 'object',
    required: true,
    properties: {
      businessRegulations: {
        type: 'array',
        required: true,
        items: {
          type: 'string',
        },
      },
      corruptionLevel: {
        type: 'string',
        required: true,
        enum: Object.values(CorruptionLevel),
      },
      blackMarketPresence: {
        type: 'boolean',
        required: true,
      },
    },
  },
  culturalFactors: {
    type: 'object',
    required: true,
    properties: {
      workforceSkillLevel: {
        type: 'string',
        required: true,
        enum: Object.values(WorkforceSkillLevel),
      },
      culturalPreferences: {
        type: 'object',
        required: true,
      },
      socialUnrest: {
        type: 'string',
        required: true,
        enum: Object.values(SocialUnrestLevel),
      },
    },
  },
  geopoliticalFactors: {
    type: 'object',
    required: true,
    properties: {
      tradeRelationships: {
        type: 'array',
        required: true,
        items: {
          type: 'string',
        },
      },
      politicalEventsFrequency: {
        type: 'string',
        required: true,
        enum: Object.values(PoliticalEventFrequency),
      },
      regionalAlliances: {
        type: 'array',
        required: true,
        items: {
          type: 'string',
        },
      },
    },
  },
  naturalResources: {
    type: 'object',
    required: true,
    properties: {
      resources: {
        type: 'array',
        required: true,
        items: {
          type: 'string',
        },
      },
      resourceAbundance: {
        type: 'object',
        required: true,
      },
    },
  },
  marketSize: {
    type: 'object',
    required: true,
    properties: {
      population: {
        type: 'number',
        required: true,
        min: 0,
      },
      consumerWealth: {
        type: 'string',
        required: true,
        enum: Object.values(ConsumerWealthLevel),
      },
      ageDemographics: {
        type: 'object',
        required: true,
      },
    },
  },
  technologicalDevelopment: {
    type: 'object',
    required: true,
    properties: {
      infrastructureLevel: {
        type: 'string',
        required: true,
        enum: Object.values(InfrastructureLevel),
      },
      internetAccessibility: {
        type: 'string',
        required: true,
        enum: Object.values(AccessibilityLevel),
      },
    },
  },
  security: {
    type: 'object',
    required: true,
    properties: {
      crimeRate: {
        type: 'string',
        required: true,
        enum: Object.values(CrimeLevel),
      },
      securityCosts: {
        type: 'number',
        required: true,
        min: 0,
      },
    },
  },
}

export const updateLocationSchema: ValidationSchema = {
  name: {
    type: 'string',
    required: false,
    minLength: 2,
    maxLength: 100,
  },
  governmentType: {
    type: 'string',
    required: false,
    enum: Object.values(GovernmentType),
  },
  economicFactors: {
    type: 'object',
    required: false,
    properties: {
      baseCurrency: {
        type: 'string',
        required: false,
      },
      economicStability: {
        type: 'string',
        required: false,
        enum: Object.values(StabilityLevel),
      },
      marketDemand: {
        type: 'object',
        required: false,
      },
      taxRate: {
        type: 'number',
        required: false,
        min: 0,
        max: 100,
      },
    },
  },
  legalEnvironment: {
    type: 'object',
    required: false,
    properties: {
      businessRegulations: {
        type: 'array',
        required: false,
        items: {
          type: 'string',
        },
      },
      corruptionLevel: {
        type: 'string',
        required: false,
        enum: Object.values(CorruptionLevel),
      },
      blackMarketPresence: {
        type: 'boolean',
        required: false,
      },
    },
  },
  culturalFactors: {
    type: 'object',
    required: false,
    properties: {
      workforceSkillLevel: {
        type: 'string',
        required: false,
        enum: Object.values(WorkforceSkillLevel),
      },
      culturalPreferences: {
        type: 'object',
        required: false,
      },
      socialUnrest: {
        type: 'string',
        required: false,
        enum: Object.values(SocialUnrestLevel),
      },
    },
  },
  geopoliticalFactors: {
    type: 'object',
    required: false,
    properties: {
      tradeRelationships: {
        type: 'array',
        required: false,
        items: {
          type: 'string',
        },
      },
      politicalEventsFrequency: {
        type: 'string',
        required: false,
        enum: Object.values(PoliticalEventFrequency),
      },
      regionalAlliances: {
        type: 'array',
        required: false,
        items: {
          type: 'string',
        },
      },
    },
  },
  naturalResources: {
    type: 'object',
    required: false,
    properties: {
      resources: {
        type: 'array',
        required: false,
        items: {
          type: 'string',
        },
      },
      resourceAbundance: {
        type: 'object',
        required: false,
      },
    },
  },
  marketSize: {
    type: 'object',
    required: false,
    properties: {
      population: {
        type: 'number',
        required: false,
        min: 0,
      },
      consumerWealth: {
        type: 'string',
        required: false,
        enum: Object.values(ConsumerWealthLevel),
      },
      ageDemographics: {
        type: 'object',
        required: false,
      },
    },
  },
  technologicalDevelopment: {
    type: 'object',
    required: false,
    properties: {
      infrastructureLevel: {
        type: 'string',
        required: false,
        enum: Object.values(InfrastructureLevel),
      },
      internetAccessibility: {
        type: 'string',
        required: false,
        enum: Object.values(AccessibilityLevel),
      },
    },
  },
  security: {
    type: 'object',
    required: false,
    properties: {
      crimeRate: {
        type: 'string',
        required: false,
        enum: Object.values(CrimeLevel),
      },
      securityCosts: {
        type: 'number',
        required: false,
        min: 0,
      },
    },
  },
}

export const getLocationSchema: ValidationSchema = {
  id: {
    type: 'string',
    required: true,
    pattern: /^[0-9a-fA-F]{24}$/, // MongoDB ObjectId pattern
  },
}
