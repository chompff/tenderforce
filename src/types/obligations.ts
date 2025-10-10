export interface LegalReference {
  label: string;
  citation: string;
  url: string;
}

export interface Warning {
  severity: 'red' | 'yellow' | 'positive';
  text: string;
}

export interface ExampleText {
  label: string;
  text: string;
}

export interface ProductLink {
  label: string;
  url: string;
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

export type SectionKey = 'scope' | 'type_opdracht' | 'functionele_behoefte' | 'levenscyclusbenadering' | 'reikwijdte_opdracht' | 'technical_specs' | 'gunningscriteria' | 'execution_conditions' | 'geschiktheidseisen';

export type ContentBlockType = 'intro' | 'warnings' | 'steps' | 'example_texts' | 'tabbed_examples' | 'specs' | 'gunningscriteria_tabs' | 'contractual_conditions' | 'contractual_conditions_tabs' | 'product_links' | 'additional_steps';

export interface ObligationSection {
  key: SectionKey;
  title: string;
  requirement_level: 'verplicht' | 'optioneel';
  intro: string;
  badges?: string[];
  warnings?: Warning[];
  steps_title?: string;
  steps?: string[];
  steps_ordered?: boolean;
  example_texts?: ExampleText[];
  tabbed_examples?: TabbedExamples;
  gunningscriteria_tabs?: GunningscriteriaTabs;
  contractual_conditions_tabs?: ContractualConditionTabs;
  specs?: Spec[];
  contractual_conditions?: ContractualCondition[];
  product_links?: ProductLink[];
  additional_steps?: string[];
  footer_note?: string;
  content_order?: ContentBlockType[];
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