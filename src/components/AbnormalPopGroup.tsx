import type { AbnormalPopulationsGroup, AmountType } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  group: AbnormalPopulationsGroup;
  dispatch: React.Dispatch<ReportAction>;
}

const QUALITATIVE_AMOUNTS = ['rare', 'few', 'occasional', 'increased'];
const POPULATION_TYPES = ['blasts', 'atypical lymphocytes', 'blastoid forms', 'immature forms'];

export function AbnormalPopGroup({ group, dispatch }: Props) {
  return (
    <fieldset className="form-group">
      <legend>Abnormal populations</legend>

      {group.entries.map((entry, index) => (
        <div key={index} className="abnormal-entry">
          <div className="entry-header">
            <span>Entry {index + 1}</span>
            <button
              type="button"
              className="btn-remove"
              onClick={() => dispatch({ type: 'REMOVE_ABNORMAL_ENTRY', index })}
            >
              Remove
            </button>
          </div>

          <div className="sub-group">
            <label className="sub-label">Amount type</label>
            <div className="radio-row">
              {(['qualitative', 'numeric', 'freetext'] as AmountType[]).map((at) => (
                <label key={at}>
                  <input
                    type="radio"
                    name={`amount-type-${index}`}
                    checked={entry.amountType === at}
                    onChange={() => dispatch({ type: 'SET_ABNORMAL_AMOUNT_TYPE', index, amountType: at })}
                  />
                  {at === 'freetext' ? 'Free text' : at.charAt(0).toUpperCase() + at.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="sub-group">
            <label className="sub-label">Amount</label>
            {entry.amountType === 'qualitative' ? (
              <select
                value={entry.amountValue}
                onChange={(e) =>
                  dispatch({ type: 'SET_ABNORMAL_AMOUNT_VALUE', index, value: e.target.value })
                }
              >
                <option value="">Select amount</option>
                {QUALITATIVE_AMOUNTS.map((a) => (
                  <option key={a} value={a}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={entry.amountValue}
                placeholder={entry.amountType === 'numeric' ? 'e.g. 4-5' : 'Free text amount'}
                onChange={(e) =>
                  dispatch({ type: 'SET_ABNORMAL_AMOUNT_VALUE', index, value: e.target.value })
                }
              />
            )}
          </div>

          <div className="sub-group">
            <label className="sub-label">Population type</label>
            <select
              value={POPULATION_TYPES.includes(entry.populationType) ? entry.populationType : entry.populationType ? '__other' : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__other') {
                  dispatch({ type: 'SET_ABNORMAL_POPULATION_TYPE', index, value: '' });
                } else {
                  dispatch({ type: 'SET_ABNORMAL_POPULATION_TYPE', index, value: val });
                }
              }}
            >
              <option value="">Select type</option>
              {POPULATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
              <option value="__other">Other (free text)</option>
            </select>
            {!POPULATION_TYPES.includes(entry.populationType) && entry.populationType !== '' && (
              <input
                type="text"
                className="other-input"
                value={entry.populationType}
                placeholder="Enter population type"
                onChange={(e) =>
                  dispatch({ type: 'SET_ABNORMAL_POPULATION_TYPE', index, value: e.target.value })
                }
              />
            )}
            {/* Show free text input when "Other" is selected and current value is empty */}
            {!POPULATION_TYPES.includes(entry.populationType) && entry.populationType === '' && (
              <input
                type="text"
                className="other-input"
                value=""
                placeholder="Enter population type"
                onChange={(e) =>
                  dispatch({ type: 'SET_ABNORMAL_POPULATION_TYPE', index, value: e.target.value })
                }
              />
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-add"
        onClick={() => dispatch({ type: 'ADD_ABNORMAL_ENTRY' })}
      >
        + Add entry
      </button>
    </fieldset>
  );
}
