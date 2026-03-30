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
  { field: 'elliptocytes', label: 'Elliptocytes', quantifierField: 'elliptocytesQuantifier' },
  { field: 'tearDropCells', label: 'Tear-drop cells', quantifierField: 'tearDropCellsQuantifier' },
  { field: 'targetCells', label: 'Target cells', quantifierField: 'targetCellsQuantifier' },
];

const QUANTIFIER_OPTIONS: { value: NonNullable<PoikilocytosisQuantifier>; label: string }[] = [
  { value: 'rare', label: 'Rare' },
  { value: 'few', label: 'Few' },
  { value: 'occasional', label: 'Occ.' },
  { value: 'increased', label: 'Incr.' },
];

export function RbcGroup({ rbc, dispatch }: Props) {
  const handleQuantifierClick = (
    field: AdditionalField,
    quantifierField: QuantifierField,
    value: NonNullable<PoikilocytosisQuantifier>,
  ) => {
    const isActive = rbc.additional[field] as boolean;
    const currentQ = rbc.additional[quantifierField];

    if (isActive && currentQ === value) {
      // Same quantifier clicked again — deselect finding entirely
      dispatch({ type: 'TOGGLE_RBC_ADDITIONAL', field });
    } else {
      // Enable finding if not active, then set quantifier
      if (!isActive) dispatch({ type: 'TOGGLE_RBC_ADDITIONAL', field });
      dispatch({ type: 'SET_RBC_QUANTIFIER', field: quantifierField, value });
    }
  };

  const handleNameClick = (field: AdditionalField, quantifierField: QuantifierField) => {
    const isActive = rbc.additional[field] as boolean;
    if (isActive) {
      // Toggle off
      dispatch({ type: 'TOGGLE_RBC_ADDITIONAL', field });
    } else {
      // Toggle on without quantifier
      dispatch({ type: 'TOGGLE_RBC_ADDITIONAL', field });
      dispatch({ type: 'SET_RBC_QUANTIFIER', field: quantifierField, value: null });
    }
  };

  const handleOtherQuantifierClick = (value: NonNullable<PoikilocytosisQuantifier>) => {
    const currentQ = rbc.additional.otherTextQuantifier;
    if (currentQ === value) {
      dispatch({ type: 'SET_RBC_QUANTIFIER', field: 'otherTextQuantifier', value: null });
    } else {
      dispatch({ type: 'SET_RBC_QUANTIFIER', field: 'otherTextQuantifier', value });
    }
  };

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
          <div className="poik-grid">
            {POIKILOCYTOSIS_FINDINGS.map((cb) => {
              const isActive = rbc.additional[cb.field] as boolean;
              const currentQ = rbc.additional[cb.quantifierField] as PoikilocytosisQuantifier;
              return (
                <div key={cb.field} className={`poik-card${isActive ? ' poik-card--active' : ''}`}>
                  <button
                    type="button"
                    className={`poik-name${isActive && !currentQ ? ' poik-name--selected' : ''}`}
                    onClick={() => handleNameClick(cb.field, cb.quantifierField)}
                  >
                    {cb.label}
                  </button>
                  <div className="poik-pills">
                    {QUANTIFIER_OPTIONS.map((q) => (
                      <button
                        key={q.value}
                        type="button"
                        className={`poik-pill${currentQ === q.value ? ' poik-pill--active' : ''}`}
                        onClick={() => handleQuantifierClick(cb.field, cb.quantifierField, q.value)}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`poik-other-wrapper${rbc.additional.otherText.trim() ? ' poik-other-wrapper--has-text' : ''}`}>
            <input
              id="rbc-other"
              type="text"
              className="poik-other-input"
              value={rbc.additional.otherText}
              onChange={(e) => dispatch({ type: 'SET_RBC_OTHER_TEXT', value: e.target.value })}
              placeholder="Other RBC findings..."
            />
            {rbc.additional.otherText.trim() && (
              <div className="poik-pills">
                {QUANTIFIER_OPTIONS.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    className={`poik-pill${rbc.additional.otherTextQuantifier === q.value ? ' poik-pill--active' : ''}`}
                    onClick={() => handleOtherQuantifierClick(q.value)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
