export type RbcStatus = 'anemia' | 'polycythemia' | null;
export type RbcSize = 'microcytic' | 'normocytic' | 'macrocytic' | null;
export type RbcChromia = 'hypochromic' | 'normochromic' | 'hyperchromic' | null;

export interface RbcAdditionalFindings {
  anisocytosis: boolean;
  poikilocytosis: boolean;
  schistocytes: boolean;
  tearDropCells: boolean;
  targetCells: boolean;
  elliptocytes: boolean;
  otherText: string;
}

export interface RbcGroup {
  status: RbcStatus;
  size: RbcSize;
  chromia: RbcChromia;
  additional: RbcAdditionalFindings;
}
