(function (n) {
  const i = (n['ms'] = n['ms'] || {});
  i.dictionary = Object.assign(i.dictionary || {}, {
    'Cannot upload file:': 'Gagal memuat naik fail',
  });
  i.getPluralForm = function (n) {
    return 0;
  };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
