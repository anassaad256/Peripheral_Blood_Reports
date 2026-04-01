export type NrbcQuantifier = 'few' | 'increased' | null;

export interface NrbcGroup {
  nucleatedRbcs: boolean;
  nucleatedRbcsQuantifier: NrbcQuantifier;
  reticulocytosis: boolean;
}
