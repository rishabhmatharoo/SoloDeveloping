importScripts("data.js");

var R = self.Routine;

/* Badge shows how many of today's objectives are left, or a tick when the quest is cleared. */
async function updateBadge() {
  var state = await R.load(), tn = R.todayNum(state);
  var text = "", color = "#7B4DFF", title = "Daily Quest";
  if (tn < 1) {
    title += " · begins in " + (1 - tn) + "d";
  } else if (tn > R.DAYS) {
    title += " · all quests cleared";
  } else if (R.isOffToday()) {
    text = "off";
    color = "#3A4660";
    title += " · rest day, next up Day " + tn;
  } else {
    var left = R.remaining(state, tn);
    text = left ? String(left) : "✓";
    if (left) color = "#2F7BFF";
    title += " · Day " + tn + (left ? " · " + left + " left" : " · cleared");
  }
  await chrome.action.setBadgeText({ text: text });
  await chrome.action.setBadgeBackgroundColor({ color: color });
  await chrome.action.setTitle({ title: title });
}

/* One-time move of progress saved under the old default start date to the new one. */
async function migrateStart() {
  var flag = await chrome.storage.local.get("startMigrated");
  if (flag.startMigrated) return;
  var r = await chrome.storage.sync.get("routine90");
  if (r.routine90 && r.routine90.start === R.OLD_DEFAULT_START) {
    r.routine90.start = R.DEFAULT_START;
    await chrome.storage.sync.set(r);
  }
  await chrome.storage.local.set({ startMigrated: true });
}

function ensureAlarm() { chrome.alarms.create("refresh", { periodInMinutes: 15 }); }

chrome.runtime.onInstalled.addListener(async function (details) {
  ensureAlarm();
  await migrateStart();
  updateBadge();
  if (details.reason === "install") chrome.tabs.create({ url: chrome.runtime.getURL("tracker.html") });
});
chrome.runtime.onStartup.addListener(function () { ensureAlarm(); updateBadge(); });
chrome.alarms.onAlarm.addListener(function (a) { if (a.name === "refresh") updateBadge(); });
R.onChange(function () { updateBadge(); });
