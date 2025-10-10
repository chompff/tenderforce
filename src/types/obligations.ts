export interface LegalReference {
  label: string;
  citation: string;
  url: string;
}

export interface Warning {
  severity: 'red' | 'yellow';
  text: string;
}

export interface ExampleText {
  label: string;
  text: string;
}

export interface Spec {
  code: string;
  text: string;
  legal_basis: string;
  requirement_level?: 'verplicht' | 'voorwaardelijk_verplicht' | 'aanbevolen' | 'optioneel';
}

export interface ContractualCondition {
  code: string;
  text: string;
  legal_basis: string;
}

export interface TabbedExample {
  title: string;
  text: string;
}

export interface TabbedExamples {
  basis?: TabbedExample[];
  ambitieus?: TabbedExample[];
}

export interface GunningscriteriumItem {
  code: string;
  title: string;
  description: string;
  points?: string[];
  legal_basis: string;
}

export interface GunningscriteriaTabs {
  circulariteit?: GunningscriteriumItem[];
  milieu_impact?: GunningscriteriumItem[];
  sociaal?: GunningscriteriumItem[];
  kwaliteit_levensduur?: GunningscriteriumItem[];
  certificering_labels?: GunningscriteriumItem[];
  logistiek_transport?: GunningscriteriumItem[];
}

export interface ContractualConditionTabs {
  arbeidsomstandigheden?: ContractualCondition[];
  sociale_normen?: ContractualCondition[];
  milieunormen?: ContractualCondition[];
}

export type SectionKey = 'scope' | 'type_opdracht' | 'functionele_behoefte' | 'levenscyclusbenadering' | 'reikwijdte_opdracht' | 'technical_specs' | 'gunningscriteria' | 'execution_conditions';

export interface ObligationSection {
  key: SectionKey;
  title: string;
  requirement_level: 'verplicht' | 'aanbevolen';
  intro: string;
  warnings?: Warning[];
  steps?: string[];
  steps_ordered?: boolean;
  example_texts?: ExampleText[];
  tabbed_examples?: TabbedExamples;
  gunningscriteria_tabs?: GunningscriteriaTabs;
  contractual_conditions_tabs?: ContractualConditionTabs;
  specs?: Spec[];
  contractual_conditions?: ContractualCondition[];
  footer_note?: string;
}

export interface Obligation {
  obligation_id: string;
  archetype: string;
  title: string;
  summary: string;
  badges: string[];
  warnings?: Warning[];
  footer_warnings?: Warning[];
  legal_references: LegalReference[];
  sections: ObligationSection[];
}