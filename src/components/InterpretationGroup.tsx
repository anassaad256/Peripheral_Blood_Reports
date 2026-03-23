import type { InterpretationsGroup, InterpretationKey } from '../types';
import type { ReportAction } from '../hooks/useReportState';
import { INTERPRETATION_ORDER, INTERPRETATION_LABELS, INTERPRETATION_STATEMENTS } from '../constants/interpretations';

interface Props {
  interpretations: InterpretationsGroup;
  dispatch: React.Dispatch<ReportAction>;
}

export function InterpretationGroup({ interpretations, dispatch }: Props) {
  return (
    <section className="form-group">
      <div className="section-header">
        <span className="material-symbols-outlined">rate_review</span>
        <h2>Interpretation &amp; Disclosures</h2>
      </div>

      <div className="sub-group">
        <label className="sub-label">Predefined Statements</label>
        <div className="interp-chips">
          {INTERPRETATION_ORDER.map((key: InterpretationKey) => {
            const isSelected = interpretations.selected.includes(key);
            return (
              <label
                key={key}
                className={`interp-chip ${isSelected ? 'selected' : ''}`}
                title={INTERPRETATION_STATEMENTS[key]}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => dispatch({ type: 'TOGGLE_INTERPRETATION', key })}
                />
                {INTERPRETATION_LABELS[key]}
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
