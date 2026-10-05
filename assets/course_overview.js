(function (root) {
  const partUrls = [
    'prologue.html',
    ...Array.from({ length: 8 }, (_, moduleIndex) =>
      Array.from({ length: 4 }, (_, partIndex) =>
        `lesson_${moduleIndex + 1}_${partIndex + 1}.html`
      )
    ).flat()
  ];

  function firstIncompletePart(completedParts) {
    const index = completedParts.findIndex(done => done !== true);
    return partUrls[index < 0 ? 0 : index];
  }

  function moduleStatus(completedParts) {
    if (!completedParts.some(Boolean)) return 'Not started';
    if (completedParts.every(Boolean)) return 'Completed';
    return 'In progress';
  }

  function validateName(value) {
    const normalized = String(value || '').trim().replace(/\s+/gu, ' ');
    if (normalized.length < 1 || normalized.length > 50) return null;
    return /^[\p{L}](?:[\p{L}'’ -]{0,48}[\p{L}])?$/u.test(normalized) ? normalized : null;
  }

  function safeCompleted(key) {
    try {
      return root.localStorage.getItem(key) === 'true';
    } catch (_) {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      root.localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  const api = { firstIncompletePart, moduleStatus, validateName, safeCompleted, safeRemove };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CourseOverview = api;
})(typeof window !== 'undefined' ? window : globalThis);
