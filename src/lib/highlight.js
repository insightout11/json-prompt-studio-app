// Server-side JSON syntax highlighting — emits spans, zero client JS.

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightJson(jsonString) {
  const escaped = escapeHtml(jsonString);
  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (match, str, _esc, colon, bool) => {
      if (str) {
        if (colon) return `<span class="j-key">${str}</span>${colon}`;
        if (/\{\{[a-z0-9_]+\}\}/i.test(str)) return `<span class="j-var">${str}</span>`;
        return `<span class="j-str">${str}</span>`;
      }
      if (bool) return `<span class="j-bool">${bool}</span>`;
      return `<span class="j-num">${match}</span>`;
    }
  );
}
