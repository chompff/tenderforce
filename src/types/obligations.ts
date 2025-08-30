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

export interface MandatorySpec {
  code: string;
  text: string;
  legal_basis: string;
}

export interface ContractualCondition {
  code: string;
  text: string;
  legal_basis: string;
}

export type SectionKey = 'scope' | 'technical_specs' | 'gunningscriteria' | 'execution_conditions';

export interface ObligationSection {
  key: SectionKey;
  title: string;
  requirement_level: 'verplicht' | 'aanbevolen';
  intro: string;
  warnings?: Warning[];
  steps?: string[];
  example_texts?: ExampleText[];
  mandatory_specs?: MandatorySpec[];
  contractual_conditions?: ContractualCondition[];
}

export interface Obligation {
  obligation_id: string;
  archetype: string;
  title: string;
  summary: string;
  badges: string[];
  legal_references: LegalReference[];
  sections: ObligationSection[];
  notes?: string[];
}