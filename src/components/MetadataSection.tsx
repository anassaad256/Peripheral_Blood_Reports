import type { SessionAction } from '../hooks/useSession';

interface Props {
  caseId: string;
  dispatch: React.Dispatch<SessionAction>;
}

export function MetadataSection({ caseId, dispatch }: Props) {
  return (
    <div className="field" style={{ marginBottom: 20, maxWidth: 300 }}>
      <label htmlFor="caseId">Case Accession ID</label>
      <input
        id="caseId"
        type="text"
        value={caseId}
        onChange={(e) => dispatch({ type: 'SET_CASE_ID', value: e.target.value })}
        placeholder="e.g. PBS-88291"
      />
    </div>
  );
}
