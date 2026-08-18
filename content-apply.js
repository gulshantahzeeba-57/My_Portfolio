/* =========================================================
   CONTENT-APPLY — reads any saved edits from the Admin Panel
   (localStorage key "gt_site_content") and applies them to
   every element on this page carrying a data-edit id, before
   the rest of the page's own scripts run.

   NOTE ON HOW THIS WORKS (static site, no server):
   Because this is a static HTML/CSS/JS site with no backend,
   edits saved in the Admin Panel are stored in that browser's
   localStorage only. They will show up every time Gulshan (or
   whoever) opens the site in THAT SAME browser, but they will
   NOT be visible to other visitors, other devices, or other
   browsers — there is no database to sync it to. To make an
   edit permanent/visible to everyone, use the "Export edits"
   button in the Admin Panel and paste the values into the
   actual HTML files, or hand the JSON to a developer to do so.
========================================================= */
(function () {
  var STORAGE_KEY = 'gt_site_content';
  var saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    saved = {};
  }
  if (!saved || Object.keys(saved).length === 0) return;

  document.querySelectorAll('[data-edit]').forEach(function (el) {
    var key = el.getAttribute('data-edit');
    if (!(key in saved)) return;
    var value = saved[key];
    var mode = el.getAttribute('data-edit-attr'); // e.g. "text+href", "text+mailto"

    if (mode === 'text+href') {
      el.textContent = value;
      el.setAttribute('href', value.indexOf('http') === 0 ? value : 'https://' + value);
    } else if (mode === 'text+mailto') {
      el.textContent = value;
      el.setAttribute('href', 'mailto:' + value);
    } else {
      el.textContent = value;
    }
  });
})();
