import type { ReportMetadata } from '../types';

function formatDate(dateStr: string): string {
  // Convert YYYY-MM-DD (from date picker) to M/D/YYYY
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${parseInt(month)}/${parseInt(day)}/${year}`;
  }
  // Otherwise return as-is (already in M/D/YYYY or other user-entered format)
  return dateStr;
}

export function renderMetadata(meta: ReportMetadata): string {
  const lines: string[] = [];
  if (meta.date.trim()) lines.push(`Date: ${formatDate(meta.date.trim())}`);
  if (meta.caseId.trim()) lines.push(`Case ID: ${meta.caseId.trim()}`);
  if (meta.signingPathologist.trim()) lines.push(`Signing pathologist: ${meta.signingPathologist.trim()}`);
  return lines.join('\n');
}
