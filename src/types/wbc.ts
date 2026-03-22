export type WbcCountCategory = 'leukocytosis' | 'normal_wbc_count' | 'leukopenia' | null;

export type DifferentialType =
  | 'neutropenia'
  | 'neutrophilia'
  | 'lymphopenia'
  | 'lymphocytosis'
  | 'monocytopenia'
  | 'monocytosis'
  | 'eosinophilia'
  | 'basophilia';

export interface DifferentialAbnormality {
  type: DifferentialType;
  absolute: boolean;
  relative: boolean;
}

export interface WbcGroup {
  countCategory: WbcCountCategory;
  differentials: DifferentialAbnormality[];
}
