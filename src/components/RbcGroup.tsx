import type { RbcGroup as RbcGroupType, RbcStatus, RbcSize, RbcChromia, PoikilocytosisQuantifier } from '../types';
import type { SessionAction } from '../hooks/useSession';

interface Props {
  rbc: RbcGroupType;
  dispatch: React.Dispatch<SessionAction>;
}

const STATUS_OPTIONS: { value: RbcStatus; label: string }[] = [
  { value: 'anemia', label: 'Anemia' },
  { value: 'polycythemia', label: 'Polycythemia' },
];

const SIZE_OPTIONS: { value: RbcSize; label: string }[] = [
  { value: 'microcytic', label: 'Microcytic' },
  { value: 'normocytic', label: 'Normocytic' },
  { value: 'macrocytic', label: 'Macrocytic' },
];

const CHROMIA_OPTIONS: { value: RbcChromia; label: string }[] = [
  { value: 'hypochromic', label: 'Hypochromic' },
  { value: 'normochromic', label: 'Normochromic' },
  { value: 'hyperchromic', label: 'Hyperchromic' },
];

type AdditionalField = 'anisocytosis' | 'poikilocytosis' | 'schistocytes' | 'tearDropCells' | 'targetCells' | 'elliptocytes';
type QuantifierField = 'schistocytesQuantifier' | 'tearDropCellsQuantifier' | 'targetCellsQuantifier' | 'elliptocytesQuantifier' | 'otherTextQuantifier';

const PRIMARY_CHECKBOXES: { field: AdditionalField; label: string }[] = [
  { field: 'anisocytosis', label: 'Anisocytosis' },
  { field: 'poikilocytosis', label: 'Poikilocytosis' },
];

const POIKILOCYTOSIS_FINDINGS: { field: AdditionalField; label: string; quantifierField: QuantifierField }[] = [
  { field: 'schistocytes', label: 'Schistocytes', quantifierField: 'schistocytesQuantifier' },
  { field: 'tearDropCells', label: 'Tear-drop cells', quantifierField: 'tearDropCellsQuantifier' },
  { field: 'targetCells', label: 'Target cells', quantifierField: 'targetCellsQuantifier' },
  { field: 'elliptocytes', label: 'Elliptocytes', quantifierField: 'elliptocytesQuantifier' },
];

const QUANTIFIER_OPTIONS: { value: PoikilocytosisQuantifier; label: string }[] = [
  { value: 'rare', label: 'Rare' },
  { value: 'few', label: 'Few' },
  { value: 'occasional', label: 'Occasional' },
  { value: 'increased', label: 'Increased' },
];

export function RbcGroup({ rbc, dispatch }: Props) {
  return (
    <section className="form-group">
      <div className="section-header">
        <span className="material-symbols-outlined">bloodtype</span>
        <h2>Red Blood Cell Morphology</h2>
      </div>

      <div className="rbc-columns">
        <div className="sub-group">
          <label className="sub-label">Status</label>
          <div className="radio-row">
            {STATUS_OPTIONS.map((opt) => (
              <label key={String(opt.value)}>
                <input
                  type="radio"
                  name="rbc-status"
                  checked={rbc.status === opt.value}
                  onChange={() =>
                    dispatch({ type: 'SET_RBC_STATUS', value: rbc.status === opt.value ? null : opt.value })
                  }
                  onClick={() => {
                    if (rbc.status === opt.value) dispatch({ type: 'SET_RBC_STATUS', value: null });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="sub-group">
          <label className="sub-label">Size (MCV Correlation)</label>
          <div className="radio-row">
            {SIZE_OPTIONS.map((opt) => (
              <label key={String(opt.value)}>
                <input
                  type="radio"
                  name="rbc-size"
                  checked={rbc.size === opt.value}
                  onChange={() =>
                    dispatch({ type: 'SET_RBC_SIZE', value: rbc.size === opt.value ? null : opt.value })
                  }
                  onClick={() => {
                    if (rbc.size === opt.value) dispatch({ type: 'SET_RBC_SIZE', value: null });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="sub-group">
          <label className="sub-label">Chromia (MCH Correlation)</label>
          <div className="radio-row">
            {CHROMIA_OPTIONS.map((opt) => (
              <label key={String(opt.value)}>
                <input
                  type="radio"
                  name="rbc-chromia"
                  checked={rbc.chromia === opt.value}
                  onChange={() =>
                    dispatch({ type: 'SET_RBC_CHROMIA', value: rbc.chromia === opt.value ? null : opt.value })
                  }
                  onClick={() => {
                    if (rbc.chromia === opt.value) dispatch({ type: 'SET_RBC_CHROMIA', value: null });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="sub-group">
        <label className="sub-label">Additional Findings</label>
        <div className="checkbox-grid">
          {PRIMARY_CHECKBOXES.map((cb) => (
            <label key={cb.field}>
              <input
                type="checkbox"
                checked={rbc.additional[cb.field] as boolean}
                onChange={() => dispatch({ type: 'TOGGLE_RBC_ADDITIONAL', field: cb.field })}
              />
              {cb.label}
            </label>
          ))}
        </div>
      </div>

      {rbc.additional.poikilocytosis && (
        <div className="sub-group">
          <label className="sub-label">Poikilocytosis Findings</label>
          {POIKILOCYTOSIS_FINDINGS.map((cb) => (
            <div key={cb.field} className="poikilocytosis-finding-row">
              <label>
                <input
                  type="checkbox"
                  checked={rbc.additional[cb.field] as boolean}
                  onChange={() => dispatch({ type: 'TOGGLE_RBC_ADDITIONAL', field: cb.field })}
                />
                {cb.label}
              </label>
              {rbc.additional[cb.field] && (
                <div className="quantifier-row">
                  {QUANTIFIER_OPTIONS.map((q) => (
                    <label key={q.value} className="quantifier-label">
                      <input
                        type="radio"
                        name={`quantifier-${cb.field}`}
                        checked={rbc.additional[cb.quantifierField] === q.value}
                        onChange={() =>
                          dispatch({ type: 'SET_RBC_QUANTIFIER', field: cb.quantifierField, value: rbc.additional[cb.quantifierField] === q.value ? null : q.value })
                        }
                        onClick={() => {
                          if (rbc.additional[cb.quantifierField] === q.value)
                            dispatch({ type: 'SET_RBC_QUANTIFIER', field: cb.quantifierField, value: null });
                        }}
                      />
                      {q.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="poikilocytosis-finding-row" style={{ marginTop: 12 }}>
            <input
              id="rbc-other"
              type="text"
              value={rbc.additional.otherText}
              onChange={(e) => dispatch({ type: 'SET_RBC_OTHER_TEXT', value: e.target.value })}
              placeholder="Other RBC findings..."
              style={{ background: 'var(--surface-lowest)', border: 'none', borderRadius: 12, height: 44, padding: '8px 16px', flex: 1 }}
            />
            {rbc.additional.otherText.trim() && (
              <div className="quantifier-row">
                {QUANTIFIER_OPTIONS.map((q) => (
                  <label key={q.value} className="quantifier-label">
                    <input
                      type="radio"
                      name="quantifier-otherText"
                      checked={rbc.additional.otherTextQuantifier === q.value}
                      onChange={() =>
                        dispatch({ type: 'SET_RBC_QUANTIFIER', field: 'otherTextQuantifier', value: rbc.additional.otherTextQuantifier === q.value ? null : q.value })
                      }
                      onClick={() => {
                        if (rbc.additional.otherTextQuantifier === q.value)
                          dispatch({ type: 'SET_RBC_QUANTIFIER', field: 'otherTextQuantifier', value: null });
                      }}
                    />
                    {q.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
