(function () {
  const form = document.getElementById('certificateForm');
  const status = document.getElementById('certificateStatus');
  const preview = document.getElementById('certificatePreview');
  const printButton = document.getElementById('printCertificate');
  const error = document.getElementById('nameError');
  const firstInput = document.getElementById('firstName');
  const lastInput = document.getElementById('lastName');

  if (!CourseOverview.safeCompleted('ai_course_l8_p4_completed')) {
    form.hidden = true;
    status.innerHTML = 'Сначала завершите итоговую самопроверку. <a href="lesson_8_4.html">Перейти к самопроверке</a>.';
    return;
  }
  status.textContent = 'Проверка завершена. Введите имя и фамилию для сертификата.';

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const first = CourseOverview.validateName(firstInput.value);
    const last = CourseOverview.validateName(lastInput.value);
    if (!first || !last) {
      error.textContent = 'Введите имя и фамилию: от 1 до 50 букв; допустимы пробелы, дефисы и апострофы.';
      preview.classList.remove('visible');
      printButton.disabled = true;
      return;
    }
    error.textContent = '';
    document.getElementById('personName').textContent = first + ' ' + last;
    document.getElementById('certificateDate').textContent = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(new Date());
    preview.classList.add('visible');
    printButton.disabled = false;
    status.textContent = 'Предпросмотр готов. Используйте печать браузера и выберите сохранение в PDF.';
  });

  printButton.addEventListener('click', function () { window.print(); });
  [firstInput, lastInput].forEach(function (input) {
    input.addEventListener('input', function () {
      preview.classList.remove('visible');
      printButton.disabled = true;
      error.textContent = '';
      status.textContent = 'Данные изменены. Нажмите «Показать сертификат», чтобы обновить предпросмотр.';
    });
  });
})();
