import type { ReportMetadata } from './metadata';
import type { RbcGroup } from './rbc';
import type { NrbcGroup } from './nrbc';
import type { WbcGroup } from './wbc';
import type { AbnormalPopulationsGroup } from './abnormalPopulations';
import type { PlateletGroup } from './platelets';
import type { InterpretationsGroup } from './interpretations';

export interface ReportInput {
  metadata: ReportMetadata;
  hasAbnormalities: boolean | null;
  rbc: RbcGroup;
  nrbc: NrbcGroup;
  wbc: WbcGroup;
  abnormalPopulations: AbnormalPopulationsGroup;
  platelets: PlateletGroup;
  interpretations: InterpretationsGroup;
}
