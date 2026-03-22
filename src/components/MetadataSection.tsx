import type { ReportMetadata } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  metadata: ReportMetadata;
  dispatch: React.Dispatch<ReportAction>;
}

export function MetadataSection({ metadata, dispatch }: Props) {
  return (
    <fieldset className="form-group">
      <legend>Metadata</legend>
      <div className="field">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={metadata.date}
          onChange={(e) => dispatch({ type: 'SET_DATE', value: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="caseId">Case ID</label>
        <input
          id="caseId"
          type="text"
          value={metadata.caseId}
          onChange={(e) => dispatch({ type: 'SET_CASE_ID', value: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="signingPathologist">Signing pathologist</label>
        <input
          id="signingPathologist"
          type="text"
          value={metadata.signingPathologist}
          onChange={(e) => dispatch({ type: 'SET_SIGNING_PATHOLOGIST', value: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="billingCode1">Billing code 1</label>
        <input
          id="billingCode1"
          type="text"
          value={metadata.billingCode1}
          onChange={(e) => dispatch({ type: 'SET_BILLING_CODE_1', value: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="billingCode2">Billing code 2</label>
        <input
          id="billingCode2"
          type="text"
          value={metadata.billingCode2}
          onChange={(e) => dispatch({ type: 'SET_BILLING_CODE_2', value: e.target.value })}
        />
      </div>
    </fieldset>
  );
}
