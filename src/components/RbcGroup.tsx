import type { RbcGroup as RbcGroupType, RbcStatus, RbcSize, RbcChromia } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  rbc: RbcGroupType;
  dispatch: React.Dispatch<ReportAction>;
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

const ADDITIONAL_CHECKBOXES: { field: 'reticulocytosis' | 'anisocytosis' | 'poikilocytosis' | 'schistocytes' | 'tearDropCells' | 'targetCells'; label: string }[] = [
  { field: 'reticulocytosis', label: 'Reticulocytosis' },
  { field: 'anisocytosis', label: 'Anisocytosis' },
  { field: 'poikilocytosis', label: 'Poikilocytosis' },
  { field: 'schistocytes', label: 'Schistocytes' },
  { field: 'tearDropCells', label: 'Tear-drop cells' },
  { field: 'targetCells', label: 'Target cells' },
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
        <label className="sub-label">Additional Findings (Multi-select)</label>
        <div className="checkbox-grid">
          {ADDITIONAL_CHECKBOXES.map((cb) => (
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
        <div className="field" style={{ marginTop: 12 }}>
          <input
            id="rbc-other"
            type="text"
            value={rbc.additional.otherText}
            onChange={(e) => dispatch({ type: 'SET_RBC_OTHER_TEXT', value: e.target.value })}
            placeholder="Other RBC findings..."
            style={{ background: 'var(--surface-lowest)', border: 'none', borderRadius: 12, height: 44, padding: '8px 16px' }}
          />
        </div>
      </div>
    </section>
  );
}
