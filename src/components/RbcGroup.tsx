import type { RbcGroup as RbcGroupType, RbcStatus, RbcSize, RbcChromia } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  rbc: RbcGroupType;
  dispatch: React.Dispatch<ReportAction>;
}

const STATUS_OPTIONS: { value: RbcStatus; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'anemia', label: 'Anemia' },
  { value: 'polycythemia', label: 'Polycythemia' },
];

const SIZE_OPTIONS: { value: RbcSize; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'microcytic', label: 'Microcytic' },
  { value: 'normocytic', label: 'Normocytic' },
  { value: 'macrocytic', label: 'Macrocytic' },
];

const CHROMIA_OPTIONS: { value: RbcChromia; label: string }[] = [
  { value: null, label: 'None' },
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
    <fieldset className="form-group">
      <legend>RBC</legend>

      <div className="sub-group">
        <label className="sub-label">Status</label>
        <div className="radio-row">
          {STATUS_OPTIONS.map((opt) => (
            <label key={String(opt.value)}>
              <input
                type="radio"
                name="rbc-status"
                checked={rbc.status === opt.value}
                onChange={() => dispatch({ type: 'SET_RBC_STATUS', value: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="sub-group">
        <label className="sub-label">Size</label>
        <div className="radio-row">
          {SIZE_OPTIONS.map((opt) => (
            <label key={String(opt.value)}>
              <input
                type="radio"
                name="rbc-size"
                checked={rbc.size === opt.value}
                onChange={() => dispatch({ type: 'SET_RBC_SIZE', value: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="sub-group">
        <label className="sub-label">Chromia</label>
        <div className="radio-row">
          {CHROMIA_OPTIONS.map((opt) => (
            <label key={String(opt.value)}>
              <input
                type="radio"
                name="rbc-chromia"
                checked={rbc.chromia === opt.value}
                onChange={() => dispatch({ type: 'SET_RBC_CHROMIA', value: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="sub-group">
        <label className="sub-label">Additional findings</label>
        <div className="checkbox-column">
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
        <div className="field">
          <label htmlFor="rbc-other">Other</label>
          <input
            id="rbc-other"
            type="text"
            value={rbc.additional.otherText}
            onChange={(e) => dispatch({ type: 'SET_RBC_OTHER_TEXT', value: e.target.value })}
            placeholder="Free text"
          />
        </div>
      </div>
    </fieldset>
  );
}
