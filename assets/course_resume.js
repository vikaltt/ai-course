(function (root) {
  const pages = [{ id: 'prologue', href: 'prologue.html', label: 'пролог' }];
  for (let lesson = 1; lesson <= 8; lesson += 1) {
    for (let part = 1; part <= 4; part += 1) {
      const id = `lesson_${lesson}_${part}`;
      pages.push({ id, href: `${id}.html`, label: `часть ${lesson}.${part}` });
    }
  }

  const pageById = new Map(pages.map(page => [page.id, page]));
  const pageByUrl = new Map(pages.map(page => [page.href, page]));
  const storageKey = 'ai_course_last_visited';

  function safeLastVisited() {
    try {
      const id = root.localStorage.getItem(storageKey);
      return pageById.has(id) ? id : null;
    } catch (_) {
      return null;
    }
  }

  function remember(id) {
    if (!pageById.has(id)) return false;
    try {
      root.localStorage.setItem(storageKey, id);
      return true;
    } catch (_) {
      return false;
    }
  }

  function rememberCurrentPage() {
    if (!root.location || typeof root.location.pathname !== 'string') return false;
    const href = root.location.pathname.slice(root.location.pathname.lastIndexOf('/') + 1);
    const page = pageByUrl.get(href);
    return page ? remember(page.id) : false;
  }

  function continueTarget(page) {
    return { href: page.href, label: `Продолжить обзор: ${page.label} →` };
  }

  function buttonTarget(completedParts) {
    const lastVisited = safeLastVisited();
    if (lastVisited) return continueTarget(pageById.get(lastVisited));

    const progress = Array.isArray(completedParts) ? completedParts : [];
    if (!progress.some(done => done === true)) {
      return { href: 'prologue.html', label: 'Начать обзор с пролога →' };
    }

    const nextIndex = progress.findIndex(done => done !== true);
    const page = pages[nextIndex < 0 ? 0 : Math.min(nextIndex, pages.length - 1)];
    if (nextIndex < 0) {
      return { href: page.href, label: 'Обзор завершён — открыть пролог снова →' };
    }
    return continueTarget(page);
  }

  function clearLastVisited() {
    try {
      root.localStorage.removeItem(storageKey);
      return true;
    } catch (_) {
      return false;
    }
  }

  const api = { buttonTarget, clearLastVisited, remember, rememberCurrentPage, safeLastVisited };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.CourseResume = api;

  rememberCurrentPage();
  if (typeof root.addEventListener === 'function') {
    root.addEventListener('pageshow', function () {
      rememberCurrentPage();
      if (typeof root.updateLMSState === 'function') root.updateLMSState();
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
