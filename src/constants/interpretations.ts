import type { InterpretationKey } from '../types';

export const INTERPRETATION_STATEMENTS: Record<InterpretationKey, string> = {
  degenerating_specimen: 'Degenerating specimen limiting accurate morphologic assessment.',
  clinical_correlation: 'Correlation with clinical findings is recommended.',
  flow: 'Flow cytometry is recommended.',
  hematology_consult: 'Hematology consultation is recommended.',
  reactive: 'Favor reactive changes.',
  microcytic_anemia: 'Favor iron deficiency or chronic blood loss. Correlate with iron studies.',
  macrocytic_anemia: 'Favor folate or vitamin B12 deficiency. Correlate with folate/vitamin B12 levels.',
  leukemia: 'Consistent with acute leukemia. Flow cytometry is required for lineage identification.',
  cll: 'Leukocytosis with atypical lymphocytosis, consisting of small to medium sized lymphocytes with clumped chromatin. Many smudge cells present. Flow cytometry needed to confirm CLL/SLL.',
};

export const INTERPRETATION_ORDER: InterpretationKey[] = [
  'degenerating_specimen',
  'clinical_correlation',
  'flow',
  'hematology_consult',
  'reactive',
  'microcytic_anemia',
  'macrocytic_anemia',
  'leukemia',
  'cll',
];

export const INTERPRETATION_LABELS: Record<InterpretationKey, string> = {
  degenerating_specimen: 'Degenerating specimen',
  clinical_correlation: 'Clinical correlation',
  flow: 'Flow',
  hematology_consult: 'Hematology consult',
  reactive: 'Reactive',
  microcytic_anemia: 'Microcytic anemia',
  macrocytic_anemia: 'Macrocytic anemia',
  leukemia: 'Leukemia',
  cll: 'CLL',
};
