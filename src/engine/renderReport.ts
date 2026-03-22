import type { ReportInput } from '../types';
import { renderMetadata } from './renderMetadata';
import { renderRbc } from './renderRbc';
import { renderNrbc } from './renderNrbc';
import { renderWbc } from './renderWbc';
import { renderAbnormalPopulations } from './renderAbnormalPopulations';
import { renderPlatelets } from './renderPlatelets';
import { renderInterpretations } from './renderInterpretations';
import { renderFooter } from './renderFooter';

export function renderReport(input: ReportInput): string {
  const sections: string[] = [];

  // Metadata header
  const metaBlock = renderMetadata(input.metadata);
  if (metaBlock) sections.push(metaBlock);

  if (input.hasAbnormalities === false) {
    // Normal report
    sections.push('Within normal limits.');
  } else if (input.hasAbnormalities === true) {
    // Finding lines in group order
    const findingLines: string[] = [];

    const rbcLine = renderRbc(input.rbc);
    if (rbcLine) findingLines.push(rbcLine);

    const nrbcLine = renderNrbc(input.nrbc);
    if (nrbcLine) findingLines.push(nrbcLine);

    const wbcLine = renderWbc(input.wbc);
    if (wbcLine) findingLines.push(wbcLine);

    const abnormalLines = renderAbnormalPopulations(input.abnormalPopulations);
    if (abnormalLines) findingLines.push(abnormalLines);

    const plateletLine = renderPlatelets(input.platelets);
    if (plateletLine) findingLines.push(plateletLine);

    if (findingLines.length > 0) {
      sections.push(findingLines.join('\n'));
    }

    // Interpretation/disclosures
    const interpBlock = renderInterpretations(input.interpretations);
    if (interpBlock) sections.push(interpBlock);
  }

  // Footer
  const footerBlock = renderFooter(input.metadata);
  if (footerBlock) sections.push(footerBlock);

  return sections.join('\n\n');
}
