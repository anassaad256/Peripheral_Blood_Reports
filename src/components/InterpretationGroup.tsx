import type { InterpretationsGroup, InterpretationKey } from '../types';
import type { ReportAction } from '../hooks/useReportState';
import { INTERPRETATION_ORDER, INTERPRETATION_LABELS, INTERPRETATION_STATEMENTS } from '../constants/interpretations';

interface Props {
  interpretations: InterpretationsGroup;
  dispatch: React.Dispatch<ReportAction>;
}

export function InterpretationGroup({ interpretations, dispatch }: Props) {
  return (
    <fieldset className="form-group">
      <legend>Interpretation / Disclosures</legend>
      <div className="checkbox-column">
        {INTERPRETATION_ORDER.map((key: InterpretationKey) => (
          <label key={key} title={INTERPRETATION_STATEMENTS[key]}>
            <input
              type="checkbox"
              checked={interpretations.selected.includes(key)}
              onChange={() => dispatch({ type: 'TOGGLE_INTERPRETATION', key })}
            />
            {INTERPRETATION_LABELS[key]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
