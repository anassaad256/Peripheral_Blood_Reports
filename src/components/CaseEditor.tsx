import { useState, useEffect, useRef } from 'react';
import type { Session } from '../types';
import { toReportInput } from '../types';
import type { SessionAction } from '../hooks/useSession';
import { renderReport } from '../engine/renderReport';
import { MetadataSection } from './MetadataSection';
import { AbnormalityGate } from './AbnormalityGate';
import { RbcGroup } from './RbcGroup';
import { NrbcGroup } from './NrbcGroup';
import { WbcGroup } from './WbcGroup';
import { AbnormalPopGroup } from './AbnormalPopGroup';
import { PlateletGroup } from './PlateletGroup';
import { InterpretationGroup } from './InterpretationGroup';
import { CaseReportPreview } from './CaseReportPreview';

interface Props {
  session: Session;
  dispatch: React.Dispatch<SessionAction>;
}

export function CaseEditor({ session, dispatch }: Props) {
  const activeCase = session.cases[session.activeCaseIndex];
  const [previewText, setPreviewText] = useState(activeCase.generatedReport ?? '');
  const prevCaseId = useRef(activeCase.id);

  // Reset preview when switching cases
  useEffect(() => {
    if (prevCaseId.current !== activeCase.id) {
      setPreviewText(activeCase.generatedReport ?? '');
      prevCaseId.current = activeCase.id;
    }
  }, [activeCase.id, activeCase.generatedReport]);

  function handleGenerate() {
    const input = toReportInput(session.metadata, activeCase);
    const text = renderReport(input);
    setPreviewText(text);
  }

  function handleAddToReport() {
    dispatch({ type: 'SET_GENERATED_REPORT', text: previewText });
  }

  function handleResetCase() {
    dispatch({ type: 'RESET_CASE' });
    setPreviewText('');
  }

  const hasContent = activeCase.hasAbnormalities !== null;

  return (
    <div className="case-editor">
      <MetadataSection caseId={activeCase.caseId} dispatch={dispatch} />
      <AbnormalityGate value={activeCase.hasAbnormalities} dispatch={dispatch} />

      {activeCase.hasAbnormalities === true && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <RbcGroup rbc={activeCase.rbc} dispatch={dispatch} />
          <NrbcGroup nrbc={activeCase.nrbc} dispatch={dispatch} />
          <WbcGroup wbc={activeCase.wbc} dispatch={dispatch} />
          <AbnormalPopGroup group={activeCase.abnormalPopulations} dispatch={dispatch} />
          <PlateletGroup platelets={activeCase.platelets} dispatch={dispatch} />
          <InterpretationGroup interpretations={activeCase.interpretations} dispatch={dispatch} />
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-reset" onClick={handleResetCase}>
          Reset Case
        </button>
        <button
          type="button"
          className="btn-generate"
          disabled={!hasContent}
          onClick={handleGenerate}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>description</span>
          Generate Report
        </button>
      </div>

      {previewText && (
        <CaseReportPreview
          text={previewText}
          onTextChange={setPreviewText}
          onAddToReport={handleAddToReport}
          isAdded={activeCase.generatedReport === previewText}
        />
      )}
    </div>
  );
}
