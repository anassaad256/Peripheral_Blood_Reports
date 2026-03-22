import { useState, useMemo } from 'react';
import { useReportState } from '../hooks/useReportState';
import { renderReport } from '../engine/renderReport';
import { isGenerateDisabled } from '../validation/validateInput';
import { MetadataSection } from './MetadataSection';
import { AbnormalityGate } from './AbnormalityGate';
import { RbcGroup } from './RbcGroup';
import { NrbcGroup } from './NrbcGroup';
import { WbcGroup } from './WbcGroup';
import { AbnormalPopGroup } from './AbnormalPopGroup';
import { PlateletGroup } from './PlateletGroup';
import { InterpretationGroup } from './InterpretationGroup';
import { ReportPreview } from './ReportPreview';

export function ReportForm() {
  const { state, dispatch } = useReportState();
  const [reportText, setReportText] = useState('');

  const disabled = useMemo(() => isGenerateDisabled(state), [state]);

  function handleGenerate() {
    const text = renderReport(state);
    setReportText(text);
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
    setReportText('');
  }

  return (
    <div className="report-form">
      <MetadataSection metadata={state.metadata} dispatch={dispatch} />
      <AbnormalityGate value={state.hasAbnormalities} dispatch={dispatch} />

      {state.hasAbnormalities === true && (
        <>
          <RbcGroup rbc={state.rbc} dispatch={dispatch} />
          <NrbcGroup nrbc={state.nrbc} dispatch={dispatch} />
          <WbcGroup wbc={state.wbc} dispatch={dispatch} />
          <AbnormalPopGroup group={state.abnormalPopulations} dispatch={dispatch} />
          <PlateletGroup platelets={state.platelets} dispatch={dispatch} />
          <InterpretationGroup interpretations={state.interpretations} dispatch={dispatch} />
        </>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn-generate"
          disabled={disabled}
          onClick={handleGenerate}
        >
          Generate report
        </button>
        <button type="button" className="btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      <ReportPreview reportText={reportText} />
    </div>
  );
}
