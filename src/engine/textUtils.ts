export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

export function capitalizeLine(s: string): string {
  if (s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function endWithPeriod(s: string): string {
  if (s.length === 0) return s;
  if (s.endsWith('.')) return s;
  return s + '.';
}

export function formatLine(s: string): string {
  return endWithPeriod(capitalizeLine(s));
}
