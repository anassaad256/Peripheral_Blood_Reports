export type PredefinedAmount = 'rare' | 'few' | 'occasional' | 'increased';

export type AmountType = 'qualitative' | 'numeric' | 'freetext';

export type PredefinedPopulationType =
  | 'blasts'
  | 'atypical lymphocytes'
  | 'blastoid forms'
  | 'immature forms';

export interface AbnormalPopulationEntry {
  amountType: AmountType;
  amountValue: string;
  populationType: string;
}

export interface AbnormalPopulationsGroup {
  entries: AbnormalPopulationEntry[];
}
