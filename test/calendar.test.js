import { test } from "node:test";
import assert from "node:assert/strict";
import { ics, googleUrl, expandCalendars } from "../src/calendar.mjs";

test("ics files are valid all-day yearly events", () => {
  const text = ics("puck-fair");
  assert.match(text, /DTSTART;VALUE=DATE:20270810\r\n/);
  assert.match(text, /DTEND;VALUE=DATE:20270813\r\n/); // exclusive: covers 10, 11 and 12 August
  assert.match(text, /RRULE:FREQ=YEARLY\r\n/);
  assert.match(text, /LOCATION:Killorglin\\, County Kerry\\, Ireland/);
  for (const line of text.split("\r\n")) assert.ok(line.length <= 75, line);
});

test("single days run one day", () => {
  assert.match(ics("scattering-day"), /DTSTART;VALUE=DATE:20270812\r\nDTEND;VALUE=DATE:20270813/);
});

test("Google link carries the dates and repeats yearly", () => {
  const u = new URL(googleUrl("fair-day"));
  assert.equal(u.searchParams.get("dates"), "20270811/20270812");
  assert.equal(u.searchParams.get("recur"), "RRULE:FREQ=YEARLY");
});

test("page placeholders expand, unknown ids fail the build", () => {
  const html = expandCalendars('<!-- calendar:puck-fair "Add all three days" -->');
  assert.match(html, /<summary class="btn line dark-text">Add all three days<\/summary>/);
  assert.match(html, /href="\/cal\/puck-fair\.ics" download/);
  assert.throws(() => expandCalendars("<!-- calendar:nope -->"));
});
