import type { NrbcGroup as NrbcGroupType } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  nrbc: NrbcGroupType;
  dispatch: React.Dispatch<ReportAction>;
}

export function NrbcGroup({ nrbc, dispatch }: Props) {
  return (
    <fieldset className="form-group">
      <legend>Nucleated RBC / Left shift</legend>
      <div className="checkbox-column">
        <label>
          <input
            type="checkbox"
            checked={nrbc.increasedNucleatedRbcs}
            onChange={() => dispatch({ type: 'TOGGLE_NRBC_INCREASED' })}
          />
          Increased nucleated RBCs
        </label>
        <label>
          <input
            type="checkbox"
            checked={nrbc.leftShift}
            onChange={() => dispatch({ type: 'TOGGLE_LEFT_SHIFT' })}
          />
          Left shift
        </label>
      </div>
    </fieldset>
  );
}
