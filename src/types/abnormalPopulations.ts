export type PredefinedAmount = 'rare' | 'few' | 'occasional' | 'increased';

export type AmountType = 'qualitative' | 'numeric' | 'freetext';

export type PredefinedPopulationType =
  | 'blasts'
  | 'atypical lymphocytes'
  | 'blastoid forms'
  | 'immature forms';

export type NeutrophilMorphology = 'hyposegmented' | 'hypersegmented' | 'hypogranular';

export interface AbnormalPopulationEntry {
  amountType: AmountType;
  amountValue: string;
  populationType: string;
  neutrophilMorphologies: NeutrophilMorphology[];
}

export interface AbnormalPopulationsGroup {
  entries: AbnormalPopulationEntry[];
}
