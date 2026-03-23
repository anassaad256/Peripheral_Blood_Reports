import { useState } from 'react';
import type { AbnormalPopulationsGroup } from '../types';
import type { ReportAction } from '../hooks/useReportState';

interface Props {
  group: AbnormalPopulationsGroup;
  dispatch: React.Dispatch<ReportAction>;
}

const QUALITATIVE_AMOUNTS = ['rare', 'few', 'occasional', 'increased'];
const POPULATION_TYPES = ['blasts', 'atypical lymphocytes', 'blastoid forms', 'immature forms'];

function AmountPicker({
  entry,
  index,
  dispatch,
}: {
  entry: { amountType: string; amountValue: string };
  index: number;
  dispatch: React.Dispatch<ReportAction>;
}) {
  const [showNumericInput, setShowNumericInput] = useState(entry.amountType === 'numeric');
  const [showFreetextInput, setShowFreetextInput] = useState(entry.amountType === 'freetext');

  const isQualitativeSelected = entry.amountType === 'qualitative' && QUALITATIVE_AMOUNTS.includes(entry.amountValue);
  const selectedQualitative = isQualitativeSelected ? entry.amountValue : null;

  function selectQualitative(val: string) {
    setShowNumericInput(false);
    setShowFreetextInput(false);
    dispatch({ type: 'SET_ABNORMAL_AMOUNT_TYPE', index, amountType: 'qualitative' });
    // Need to set value after type change (type change clears value)
    setTimeout(() => dispatch({ type: 'SET_ABNORMAL_AMOUNT_VALUE', index, value: val }), 0);
  }

  function selectNumeric() {
    setShowNumericInput(true);
    setShowFreetextInput(false);
    dispatch({ type: 'SET_ABNORMAL_AMOUNT_TYPE', index, amountType: 'numeric' });
  }

  function selectFreetext() {
    setShowNumericInput(false);
    setShowFreetextInput(true);
    dispatch({ type: 'SET_ABNORMAL_AMOUNT_TYPE', index, amountType: 'freetext' });
  }

  return (
    <div className="amount-picker">
      {QUALITATIVE_AMOUNTS.map((a) => (
        <label key={a} className="amount-option">
          <input
            type="radio"
            name={`amount-${index}`}
            checked={selectedQualitative === a}
            onChange={() => selectQualitative(a)}
          />
          {a.charAt(0).toUpperCase() + a.slice(1)}
        </label>
      ))}
      <label className="amount-option">
        <input
          type="radio"
          name={`amount-${index}`}
          checked={entry.amountType === 'numeric'}
          onChange={selectNumeric}
        />
        Numeric (%)
      </label>
      {showNumericInput && entry.amountType === 'numeric' && (
        <input
          type="text"
          className="amount-inline-input"
          value={entry.amountValue}
          placeholder="e.g. 4-5"
          onChange={(e) => dispatch({ type: 'SET_ABNORMAL_AMOUNT_VALUE', index, value: e.target.value })}
        />
      )}
      <label className="amount-option">
        <input
          type="radio"
          name={`amount-${index}`}
          checked={entry.amountType === 'freetext'}
          onChange={selectFreetext}
        />
        Free text
      </label>
      {showFreetextInput && entry.amountType === 'freetext' && (
        <input
          type="text"
          className="amount-inline-input"
          value={entry.amountValue}
          placeholder="Free text amount"
          onChange={(e) => dispatch({ type: 'SET_ABNORMAL_AMOUNT_VALUE', index, value: e.target.value })}
        />
      )}
    </div>
  );
}

export function AbnormalPopGroup({ group, dispatch }: Props) {
  return (
    <section className="form-group">
      <div className="section-header-spread">
        <div className="section-header-left">
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>groups</span>
          <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Abnormal Populations</h2>
        </div>
        <button
          type="button"
          className="btn-add"
          style={{ width: 'auto', border: 'none', padding: '8px 16px' }}
          onClick={() => dispatch({ type: 'ADD_ABNORMAL_ENTRY' })}
        >
          + Add Entry
        </button>
      </div>

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
            <label className="sub-label">Amount</label>
            <AmountPicker entry={entry} index={index} dispatch={dispatch} />
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
            {!POPULATION_TYPES.includes(entry.populationType) && (
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
          </div>
        </div>
      ))}

      {group.entries.length === 0 && (
        <button
          type="button"
          className="btn-add"
          onClick={() => dispatch({ type: 'ADD_ABNORMAL_ENTRY' })}
        >
          + Add entry
        </button>
      )}
    </section>
  );
}
