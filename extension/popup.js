(function () {
  "use strict";
  var R = Routine, UI = RoutineUI;
  var state = R.normalize(null);

  function $(id) { return document.getElementById(id); }

  /* Before the plan starts the popup previews Day 1; after it ends there is no card. */
  function shownDay(tn) { return tn < 1 ? 1 : tn > R.DAYS ? 0 : tn; }

  function render() {
    var s = R.stats(state), tn = s.tn, d = shownDay(tn), note = $("note"), off = R.isOffToday();
    $("pTitle").textContent = tn < 1 ? "Begins in " + (1 - tn) + " day" + (1 - tn === 1 ? "" : "s") : tn > R.DAYS ? "All quests cleared" : off ? "Rest day" : "Day " + tn + " of " + R.DAYS;
    $("pSub").textContent = UI.fmt(new Date());
    $("pLevel").textContent = s.days;
    $("pRank").textContent = s.rank;
    $("pStreak").textContent = s.streak;
    $("pTasks").textContent = s.tasks + "/" + R.TOTAL_TASKS;
    $("barFill").style.width = s.pct + "%";
    $("barPct").textContent = s.pct + "%";
    $("bar").setAttribute("aria-valuenow", s.pct);

    if (tn < 1) { note.hidden = false; note.textContent = "The quest has not begun. Preview of Day 1 on " + UI.fmt(R.dateOf(state, 1)) + "."; }
    else if (tn > R.DAYS) { note.hidden = false; note.textContent = "All 90 quests are behind you, " + s.rank + "-rank hunter. Open the status window to review."; }
    else if (off) { note.hidden = false; note.textContent = "The System grants rest. Next quest is Day " + tn + " on " + UI.fmt(R.dateOf(state, tn)) + "."; }
    else note.hidden = true;
    $("card").innerHTML = d ? UI.dayCard(state, d, tn) : "";
  }

  $("card").addEventListener("change", function (ev) {
    var el = ev.target; if (!el || el.type !== "checkbox") return;
    var before = R.stats(state);
    R.toggle(state, +el.dataset.d, el.dataset.k, el.checked);
    R.save(state);
    render();
    var again = $("t" + el.dataset.d + el.dataset.k); if (again) again.focus();
    UI.celebrate(before, R.stats(state));
  });
  $("openFull").addEventListener("click", function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("tracker.html") });
    window.close();
  });

  R.onChange(function (s) { if (!R.same(s, state)) { state = s; render(); } });

  R.load().then(function (s) { state = s; render(); }, render);
})();
