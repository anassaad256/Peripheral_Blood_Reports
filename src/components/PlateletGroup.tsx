import type { PlateletGroup as PlateletGroupType, PlateletCount } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  platelets: PlateletGroupType;
  dispatch: React.Dispatch<ReportAction>;
}

const COUNT_OPTIONS: { value: PlateletCount; label: string }[] = [
  { value: 'thrombocytopenia', label: 'Thrombocytopenia' },
  { value: 'thrombocytosis', label: 'Thrombocytosis' },
];

export function PlateletGroup({ platelets, dispatch }: Props) {
  return (
    <section className="form-group">
      <div className="section-header">
        <span className="material-symbols-outlined">grid_view</span>
        <h2>Platelets</h2>
      </div>

      <div className="platelet-grid">
        <div>
          <label className="sub-label">Count Category</label>
          <div className="radio-row">
            {COUNT_OPTIONS.map((opt) => (
              <label key={String(opt.value)}>
                <input
                  type="radio"
                  name="platelet-count"
                  checked={platelets.count === opt.value}
                  onChange={() =>
                    dispatch({ type: 'SET_PLATELET_COUNT', value: platelets.count === opt.value ? null : opt.value })
                  }
                  onClick={() => {
                    if (platelets.count === opt.value) dispatch({ type: 'SET_PLATELET_COUNT', value: null });
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="sub-label">Morphology Descriptors</label>
          <div className="checkbox-column">
            <label>
              <input
                type="checkbox"
                checked={platelets.largePlatelets}
                onChange={() => dispatch({ type: 'TOGGLE_LARGE_PLATELETS' })}
              />
              Large platelets
            </label>
            <label>
              <input
                type="checkbox"
                checked={platelets.plateletClumps}
                onChange={() => dispatch({ type: 'TOGGLE_PLATELET_CLUMPS' })}
              />
              Platelet clumps
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
