// Puck Fair calendar events. One source for the .ics files (tools/build.mjs writes public/cal/)
// and the "Add to calendar" menus (<!-- calendar:id --> in src/pages, expanded by parsePage).
// All-day events that repeat every year from the next fair, so the files never go stale.

const FIRST_YEAR = 2027;
const LOCATION = "Killorglin, County Kerry, Ireland";

export const events = {
  "puck-fair": { title: "Puck Fair", start: "0810", days: 3, desc: "Three days of Puck Fair in Killorglin: Gathering Day, Fair Day and Scattering Day. https://kingpuck.com/puck-fair" },
  "gathering-day": { title: "Puck Fair: Gathering Day", start: "0810", days: 1, desc: "The goat is paraded through Killorglin and crowned King Puck by the Queen of Puck. https://kingpuck.com/puck-fair" },
  "fair-day": { title: "Puck Fair: Fair Day", start: "0811", days: 1, desc: "The traditional horse and livestock fair, with markets and music across the town. https://kingpuck.com/puck-fair" },
  "scattering-day": { title: "Puck Fair: Scattering Day", start: "0812", days: 1, desc: "King Puck comes down from his stand and the fair draws to a close. https://kingpuck.com/puck-fair" },
};

const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
function dates(e) {
  const start = new Date(Date.UTC(FIRST_YEAR, Number(e.start.slice(0, 2)) - 1, Number(e.start.slice(2))));
  const end = new Date(start.getTime() + e.days * 86400000); // all-day DTEND is exclusive
  return [ymd(start), ymd(end)];
}

const icsText = (s) => s.replace(/[\;,]/g, (c) => "\\" + c);
// RFC 5545: lines longer than 75 octets continue on the next line after a space.
const fold = (line) => line.match(/.{1,74}/g).join("\r\n ");
export function ics(id) {
  const e = events[id];
  const [start, end] = dates(e);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//King Puck//kingpuck.com//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${id}@kingpuck.com`, "DTSTAMP:20261003T000000Z",
    `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, "RRULE:FREQ=YEARLY",
    `SUMMARY:${icsText(e.title)}`, `DESCRIPTION:${icsText(e.desc)}`, `LOCATION:${icsText(LOCATION)}`, "TRANSP:TRANSPARENT",
    "END:VEVENT", "END:VCALENDAR",
  ].map(fold).join("\r\n") + "\r\n";
}

export function googleUrl(id) {
  const e = events[id];
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", e.title);
  u.searchParams.set("dates", dates(e).join("/"));
  u.searchParams.set("details", e.desc);
  u.searchParams.set("location", LOCATION);
  u.searchParams.set("recur", "RRULE:FREQ=YEARLY");
  return u.toString();
}

// A native <details> menu: works without JavaScript and with the keyboard.
export function calendarMenu(id, label = "Add to calendar") {
  const a = (s) => s.replace(/&/g, "&amp;");
  return `<details class="cal-menu"><summary class="btn line dark-text">${label}</summary><div class="cal-options">` +
    `<a href="${a(googleUrl(id))}" target="_blank" rel="noopener">Google Calendar</a>` +
    `<a href="/cal/${id}.ics" download>Apple or Outlook (.ics)</a></div></details>`;
}

export const expandCalendars = (html) =>
  html.replace(/<!--\s*calendar:([a-z-]+)(?:\s+"([^"]+)")?\s*-->/g, (m, id, label) => {
    if (!events[id]) throw new Error(`Unknown calendar event: ${id}`);
    return calendarMenu(id, label);
  });
