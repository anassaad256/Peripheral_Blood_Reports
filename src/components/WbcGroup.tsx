import type { WbcGroup as WbcGroupType, WbcCountCategory, DifferentialType } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  wbc: WbcGroupType;
  dispatch: React.Dispatch<ReportAction>;
}

const COUNT_OPTIONS: { value: WbcCountCategory; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'leukocytosis', label: 'Leukocytosis' },
  { value: 'normal_wbc_count', label: 'Normal WBC count' },
  { value: 'leukopenia', label: 'Leukopenia' },
];

const DIFFERENTIAL_OPTIONS: { type: DifferentialType; label: string; group?: string }[] = [
  { type: 'neutropenia', label: 'Neutropenia', group: 'neutrophils' },
  { type: 'neutrophilia', label: 'Neutrophilia', group: 'neutrophils' },
  { type: 'lymphopenia', label: 'Lymphopenia', group: 'lymphocytes' },
  { type: 'lymphocytosis', label: 'Lymphocytosis', group: 'lymphocytes' },
  { type: 'monocytopenia', label: 'Monocytopenia', group: 'monocytes' },
  { type: 'monocytosis', label: 'Monocytosis', group: 'monocytes' },
  { type: 'eosinophilia', label: 'Eosinophilia' },
  { type: 'basophilia', label: 'Basophilia' },
];

// Group differentials by lineage for mutual exclusivity
const LINEAGE_GROUPS: Record<string, DifferentialType[]> = {
  neutrophils: ['neutropenia', 'neutrophilia'],
  lymphocytes: ['lymphopenia', 'lymphocytosis'],
  monocytes: ['monocytopenia', 'monocytosis'],
};

export function WbcGroup({ wbc, dispatch }: Props) {
  const selectedTypes = new Set(wbc.differentials.map((d) => d.type));

  function isDiffDisabled(diffType: DifferentialType): boolean {
    // Check lineage mutual exclusivity
    for (const types of Object.values(LINEAGE_GROUPS)) {
      if (types.includes(diffType)) {
        const other = types.find((t) => t !== diffType);
        if (other && selectedTypes.has(other)) return true;
      }
    }
    return false;
  }

  return (
    <fieldset className="form-group">
      <legend>WBC</legend>

      <div className="sub-group">
        <label className="sub-label">Count category</label>
        <div className="radio-row">
          {COUNT_OPTIONS.map((opt) => (
            <label key={String(opt.value)}>
              <input
                type="radio"
                name="wbc-count"
                checked={wbc.countCategory === opt.value}
                onChange={() => dispatch({ type: 'SET_WBC_COUNT', value: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="sub-group">
        <label className="sub-label">Differential abnormalities</label>
        <div className="checkbox-column">
          {DIFFERENTIAL_OPTIONS.map((opt) => {
            const isSelected = selectedTypes.has(opt.type);
            const disabled = isDiffDisabled(opt.type);
            const diff = wbc.differentials.find((d) => d.type === opt.type);

            return (
              <div key={opt.type} className="differential-row">
                <label className={disabled ? 'disabled' : ''}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => dispatch({ type: 'TOGGLE_DIFFERENTIAL', diffType: opt.type })}
                  />
                  {opt.label}
                </label>
                {isSelected && diff && (
                  <div className="qualifier-controls">
                    <label className={!diff.absolute && !diff.relative ? 'qualifier-required' : ''}>
                      <input
                        type="checkbox"
                        checked={diff.absolute}
                        onChange={() =>
                          dispatch({
                            type: 'TOGGLE_DIFFERENTIAL_QUALIFIER',
                            diffType: opt.type,
                            qualifier: 'absolute',
                          })
                        }
                      />
                      Absolute
                    </label>
                    <label className={!diff.absolute && !diff.relative ? 'qualifier-required' : ''}>
                      <input
                        type="checkbox"
                        checked={diff.relative}
                        onChange={() =>
                          dispatch({
                            type: 'TOGGLE_DIFFERENTIAL_QUALIFIER',
                            diffType: opt.type,
                            qualifier: 'relative',
                          })
                        }
                      />
                      Relative
                    </label>
                    {!diff.absolute && !diff.relative && (
                      <span className="validation-hint">Select at least one qualifier</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
