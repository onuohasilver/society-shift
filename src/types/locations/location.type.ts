export enum GovernmentType {
  Democracy = 'Democracy',
  Authoritarian = 'Authoritarian',
}

export enum StabilityLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum CorruptionLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum WorkforceSkillLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum SocialUnrestLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum PoliticalEventFrequency {
  Rare = 'Rare',
  Occasional = 'Occasional',
  Frequent = 'Frequent',
}

export enum ConsumerWealthLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum InfrastructureLevel {
  Poor = 'Poor',
  Moderate = 'Moderate',
  Advanced = 'Advanced',
}

export enum AccessibilityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum CrimeLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Location {
  name: string // Name of the location
  governmentType: GovernmentType // Type of government
  economicFactors: {
    baseCurrency: string // Currency used in the location
    economicStability: StabilityLevel // Stability of the economy
    marketDemand: Record<string, number> // Demand for different products or services (e.g., { "tech": 0.8, "agriculture": 0.5 })
    taxRate: number // Percentage of tax rate (e.g., 15 for 15%)
  }
  legalEnvironment: {
    businessRegulations: string[] // List of applicable regulations (e.g., ['environmental law', 'labor law'])
    corruptionLevel: CorruptionLevel // Level of corruption
    blackMarketPresence: boolean // Whether a black market exists
  }
  culturalFactors: {
    workforceSkillLevel: WorkforceSkillLevel // Skill level of the workforce
    culturalPreferences: Record<string, number> // Preferences for different types of businesses (e.g., { "tech": 1.0, "agriculture": 0.7 })
    socialUnrest: SocialUnrestLevel // Level of social unrest
  }
  geopoliticalFactors: {
    tradeRelationships: string[] // List of regions with favorable trade agreements
    politicalEventsFrequency: PoliticalEventFrequency // How often political events occur
    regionalAlliances: string[] // Alliances that the location is part of
  }
  naturalResources: {
    resources: string[] // Types of available resources (e.g., ['oil', 'gold', 'timber'])
    resourceAbundance: Record<string, number> // Abundance level of each resource (e.g., { "oil": 0.9, "gold": 0.4 })
  }
  marketSize: {
    population: number // Size of the population
    consumerWealth: ConsumerWealthLevel // Average wealth of the consumers
    ageDemographics: Record<string, number> // Age demographics (e.g., { "18-25": 0.3, "26-40": 0.5 })
  }
  technologicalDevelopment: {
    infrastructureLevel: InfrastructureLevel // Quality of the infrastructure
    internetAccessibility: AccessibilityLevel // Level of internet access
  }
  security: {
    crimeRate: CrimeLevel // Level of crime
    securityCosts: number // Cost for securing businesses in this location
  }
}
