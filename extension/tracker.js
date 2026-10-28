(function () {
  "use strict";
  var R = Routine, UI = RoutineUI;

  var state = R.normalize(null);
  var selWeek = null, timer = null, pending = false, failed = false;

  function $(id) { return document.getElementById(id); }

  /* ---------- saving ---------- */
  function setStatus() {
    $("saveState").textContent = pending ? "Saving…" : failed ? "Could not save, retrying on next change" : "Saved to your Chrome profile";
  }
  function scheduleSave() { pending = true; setStatus(); clearTimeout(timer); timer = setTimeout(flush, 400); }
  async function flush() {
    try { await R.save(state); failed = false; } catch (e) { failed = true; }
    pending = false; setStatus();
  }

  /* ---------- render ---------- */
  function weekDays(w) { var a = []; for (var d = (w - 1) * R.PER_WEEK + 1; d <= Math.min(w * R.PER_WEEK, R.DAYS); d++) a.push(d); return a; }
  function defaultWeek() { var tn = R.todayNum(state); if (tn < 1) return 1; if (tn > R.DAYS) return R.WEEKS; return Math.ceil(tn / R.PER_WEEK); }

  function renderTabs() {
    var tn = R.todayNum(state), tabs = "";
    for (var w = 1; w <= R.WEEKS; w++) {
      var ds = weekDays(w), n = 0; ds.forEach(function (d) { if (R.complete(state, d)) n++; });
      var cur = tn >= ds[0] && tn <= ds[ds.length - 1];
      tabs += '<button type="button" role="tab" class="tab' + (n === ds.length ? " full" : "") + '" data-w="' + w + '" aria-selected="' + (w === selWeek) + '">Week ' + w + '<small>' + n + '/' + ds.length + (cur ? " · now" : "") + '</small></button>';
    }
    $("tabs").innerHTML = tabs;
  }
  function renderDays() {
    var tn = R.todayNum(state), ds = weekDays(selWeek), h = "";
    ds.forEach(function (d) { h += UI.dayCard(state, d, tn); });
    $("days").innerHTML = h;
    $("wkTitle").textContent = "Week " + selWeek + " · Days " + ds[0] + " to " + ds[ds.length - 1] + " · " + UI.fmt(R.dateOf(state, ds[0])) + " to " + UI.fmt(R.dateOf(state, ds[ds.length - 1]));
    $("wkPhase").textContent = "System design: " + R.phase(R.SD_PH, ds[0]) + "   |   AI: " + R.phase(R.AI_PH, ds[0]);
  }
  function renderStats() {
    var s = R.stats(state), tn = s.tn;
    $("sLevel").innerHTML = "Lv. " + s.days + "<small> / " + R.DAYS + "</small>";
    $("sRank").innerHTML = s.rank + "<small>-rank</small>";
    $("sStreak").innerHTML = s.streak + "<small> day" + (s.streak === 1 ? "" : "s") + "</small>";
    $("sTasks").innerHTML = s.tasks + "<small> / " + R.TOTAL_TASKS + "</small>";
    $("sToday").textContent = tn < 1 ? "Starts in " + (1 - tn) + "d" : tn > R.DAYS ? "Finished" : R.isOffToday() ? "Rest day" : "Day " + tn;
    $("barFill").style.width = s.pct + "%";
    $("barPct").textContent = s.pct + "%";
    $("bar").setAttribute("aria-valuenow", s.pct);
  }
  function render() { $("start").value = state.start; renderStats(); renderTabs(); renderDays(); setStatus(); }

  /* ---------- events ---------- */
  $("days").addEventListener("change", function (ev) {
    var el = ev.target; if (!el || el.type !== "checkbox") return;
    var d = +el.dataset.d, before = R.stats(state);
    R.toggle(state, d, el.dataset.k, el.checked);
    scheduleSave();
    el.closest(".day").outerHTML = UI.dayCard(state, d, R.todayNum(state));
    var again = $("t" + d + el.dataset.k); if (again) again.focus();
    renderStats(); renderTabs();
    UI.celebrate(before, R.stats(state));
  });
  $("tabs").addEventListener("click", function (ev) {
    var b = ev.target.closest(".tab"); if (!b) return;
    selWeek = +b.dataset.w; try { localStorage.setItem("routine90week", selWeek); } catch (e) {}
    renderTabs(); renderDays();
  });
  $("goToday").addEventListener("click", function () { selWeek = defaultWeek(); renderTabs(); renderDays(); });
  $("start").addEventListener("change", function (ev) {
    if (!R.validDate(ev.target.value)) { ev.target.value = state.start; return; }
    state.start = ev.target.value; scheduleSave(); selWeek = defaultWeek(); render();
  });

  /* Ticks made in the popup or on another synced device. Skipped while a local edit is waiting to be written. */
  R.onChange(function (s) {
    if (pending || R.same(s, state)) return;
    state = s; render();
  });

  /* ---------- boot ---------- */
  (async function boot() {
    try { state = await R.load(); } catch (e) { failed = true; }
    try { var w = parseInt(localStorage.getItem("routine90week"), 10); if (w >= 1 && w <= R.WEEKS) selWeek = w; } catch (e) {}
    if (!selWeek) selWeek = defaultWeek();
    render();
  })();
})();
