import type { ReportMetadata } from '../types';

export function renderFooter(meta: ReportMetadata): string {
  const lines: string[] = [];
  if (meta.signingPathologist.trim()) {
    lines.push(`Pathologist signature: ${meta.signingPathologist.trim()}`);
  }
  if (meta.billingCode1.trim()) lines.push(meta.billingCode1.trim());
  if (meta.billingCode2.trim()) lines.push(meta.billingCode2.trim());
  return lines.join('\n');
}
