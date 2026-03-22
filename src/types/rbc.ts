export type RbcStatus = 'anemia' | 'polycythemia' | null;
export type RbcSize = 'microcytic' | 'normocytic' | 'macrocytic' | null;
export type RbcChromia = 'hypochromic' | 'normochromic' | 'hyperchromic' | null;

export interface RbcAdditionalFindings {
  reticulocytosis: boolean;
  anisocytosis: boolean;
  poikilocytosis: boolean;
  schistocytes: boolean;
  tearDropCells: boolean;
  targetCells: boolean;
  otherText: string;
}

export interface RbcGroup {
  status: RbcStatus;
  size: RbcSize;
  chromia: RbcChromia;
  additional: RbcAdditionalFindings;
}
