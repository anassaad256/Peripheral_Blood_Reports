import type { ReportMetadata } from './metadata';
import type { RbcGroup } from './rbc';
import type { NrbcGroup } from './nrbc';
import type { WbcGroup } from './wbc';
import type { AbnormalPopulationsGroup } from './abnormalPopulations';
import type { PlateletGroup } from './platelets';
import type { InterpretationsGroup } from './interpretations';

export interface SessionMetadata {
  date: string;
  signingPathologist: string;
  billingCode1: string;
  billingCode2: string;
}

export interface CaseData {
  id: string; // unique id for React keys
  caseId: string;
  hasAbnormalities: boolean | null;
  rbc: RbcGroup;
  nrbc: NrbcGroup;
  wbc: WbcGroup;
  abnormalPopulations: AbnormalPopulationsGroup;
  platelets: PlateletGroup;
  interpretations: InterpretationsGroup;
  generatedReport: string | null;
}

export interface Session {
  metadata: SessionMetadata;
  cases: CaseData[];
  activeCaseIndex: number;
  view: 'editing' | 'summary';
}

/** Convert session metadata + case data into the existing ReportInput type for rendering */
export function toReportInput(session: SessionMetadata, c: CaseData): import('./report').ReportInput {
  return {
    metadata: {
      date: session.date,
      caseId: c.caseId,
      signingPathologist: session.signingPathologist,
      billingCode1: session.billingCode1,
      billingCode2: session.billingCode2,
    } as ReportMetadata,
    hasAbnormalities: c.hasAbnormalities,
    rbc: c.rbc,
    nrbc: c.nrbc,
    wbc: c.wbc,
    abnormalPopulations: c.abnormalPopulations,
    platelets: c.platelets,
    interpretations: c.interpretations,
  };
}
