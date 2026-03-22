import type { ReportAction } from '../hooks/useReportState';

interface Props {
  value: boolean | null;
  dispatch: React.Dispatch<ReportAction>;
}

export function AbnormalityGate({ value, dispatch }: Props) {
  return (
    <fieldset className="form-group">
      <legend>Any abnormalities?</legend>
      <div className="radio-row">
        <label>
          <input
            type="radio"
            name="abnormalities"
            checked={value === true}
            onChange={() => dispatch({ type: 'SET_HAS_ABNORMALITIES', value: true })}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="abnormalities"
            checked={value === false}
            onChange={() => dispatch({ type: 'SET_HAS_ABNORMALITIES', value: false })}
          />
          No
        </label>
      </div>
    </fieldset>
  );
}
