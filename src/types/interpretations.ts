export type InterpretationKey =
  | 'degenerating_specimen'
  | 'clinical_correlation'
  | 'flow'
  | 'hematology_consult'
  | 'reactive'
  | 'microcytic_anemia'
  | 'macrocytic_anemia'
  | 'leukemia'
  | 'cll';

export interface InterpretationsGroup {
  selected: InterpretationKey[];
}
