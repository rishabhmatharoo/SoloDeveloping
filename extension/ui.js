/* Quest card markup and [System] notifications shared by the popup and the full tracker page. */
(function (g) {
  "use strict";
  var R = g.Routine;
  var GATE = { E: ["D", "D-rank"], M: ["B", "B-rank"], H: ["S", "S-rank"] };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fmt(dt) { return dt.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }); }

  function task(d, key, v, label, text, raw) {
    var id = "t" + d + key, on = (v & R.BIT[key]) ? " checked" : "";
    return '<label class="task' + (key === "dsa" ? " dsa" : "") + '" for="' + id + '"><input type="checkbox" id="' + id + '" data-d="' + d + '" data-k="' + key + '"' + on + '><div><span class="lab">' + esc(label) + '</span>' + (raw ? text : '<span class="tx">' + esc(text) + '</span>') + '</div></label>';
  }

  function dayCard(s, d, tn) {
    var v = R.stored(s, d), di = R.dsaIndex(d), done = R.complete(s, d);
    var cls = "day sys" + (d === tn ? " today" : "") + (done ? " complete" : "");
    var h = '<article class="' + cls + '" data-d="' + d + '"><div class="dhead"><div><span class="kick">Daily quest</span><h3>Day ' + d + '</h3><div class="dt">' + esc(fmt(R.dateOf(s, d))) + '</div></div><div class="pills">';
    if (di >= 0) h += '<span class="pill dsa">Dungeon</span>';
    if (d === tn) h += '<span class="pill now">' + (R.isOffToday() ? "Next quest" : "Active") + '</span>';
    if (done) h += '<span class="pill ok">Cleared</span>';
    h += '</div></div>';
    h += task(d, "office", v, "Main quest · Focus training", "90 minutes of office work, AI sealed", false);
    h += task(d, "sd", v, "Skill · System design · " + R.phase(R.SD_PH, d), R.SD[d - 1], false);
    h += task(d, "ai", v, "Skill · AI · " + R.phase(R.AI_PH, d), R.AI[d - 1], false);
    if (di >= 0) {
      var pr = R.DSA[di], t = '<span class="probs">';
      for (var i = 0; i < pr.length; i++) {
        var url = "https://leetcode.com/problemset/?search=" + encodeURIComponent(pr[i][0]), gate = GATE[pr[i][1]];
        t += '<span class="tx"><a href="' + url + '" target="_blank" rel="noopener">' + esc(pr[i][0]) + '</a><span class="diff r-' + gate[0] + '">' + gate[1] + '</span></span>';
      }
      t += "</span>";
      h += task(d, "dsa", v, "Dungeon · Clear 2 gates", t, true);
    }
    return h + "</article>";
  }

  function toast(msg) {
    var old = document.querySelector(".toast"); if (old) old.remove();
    var t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2800);
  }
  /* Announce a cleared day or a rank-up after a tick, comparing stats from before and after. */
  function celebrate(before, after) {
    if (after.rank !== before.rank && after.days > before.days) toast("[System] Rank up · " + after.rank + "-rank hunter");
    else if (after.days > before.days) toast("[System] Daily quest cleared · Lv. " + after.days);
  }

  g.RoutineUI = { esc: esc, fmt: fmt, dayCard: dayCard, toast: toast, celebrate: celebrate };
})(window);
