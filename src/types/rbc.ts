export type RbcStatus = 'anemia' | 'polycythemia' | null;
export type RbcSize = 'microcytic' | 'normocytic' | 'macrocytic' | null;
export type RbcChromia = 'hypochromic' | 'normochromic' | 'hyperchromic' | null;
export type PoikilocytosisQuantifier = 'rare' | 'few' | 'occasional' | 'increased' | null;

export interface RbcAdditionalFindings {
  anisocytosis: boolean;
  poikilocytosis: boolean;
  schistocytes: boolean;
  schistocytesQuantifier: PoikilocytosisQuantifier;
  tearDropCells: boolean;
  tearDropCellsQuantifier: PoikilocytosisQuantifier;
  targetCells: boolean;
  targetCellsQuantifier: PoikilocytosisQuantifier;
  elliptocytes: boolean;
  elliptocytesQuantifier: PoikilocytosisQuantifier;
  otherText: string;
  otherTextQuantifier: PoikilocytosisQuantifier;
}

export interface RbcGroup {
  status: RbcStatus;
  size: RbcSize;
  chromia: RbcChromia;
  additional: RbcAdditionalFindings;
}
