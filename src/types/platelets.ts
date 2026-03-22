export type PlateletCount = 'thrombocytopenia' | 'thrombocytosis' | null;

export interface PlateletGroup {
  count: PlateletCount;
  largePlatelets: boolean;
  plateletClumps: boolean;
}
