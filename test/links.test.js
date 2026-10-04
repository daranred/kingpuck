import { test } from "node:test";
import assert from "node:assert/strict";
import { externalLinks } from "../src/layout.mjs";

test("external links open in a new tab with noopener", () => {
  assert.equal(externalLinks('<a href="https://puckfair.ie/">Puck Fair</a>'), '<a href="https://puckfair.ie/" target="_blank" rel="noopener">Puck Fair</a>');
  assert.equal(externalLinks('<a class="btn" href="http://example.com/x" id="k">x</a>'), '<a href="http://example.com/x" target="_blank" rel="noopener" class="btn" id="k">x</a>');
});

test("existing rel and target are respected", () => {
  assert.equal(externalLinks('<a href="https://www.vrbo.com/s" rel="sponsored">v</a>'), '<a href="https://www.vrbo.com/s" target="_blank" rel="sponsored noopener">v</a>');
  const already = '<a href="https://x.y" target="_self" rel="noopener">z</a>';
  assert.equal(externalLinks(already), already);
});

test("internal links are untouched", () => {
  for (const a of ['<a href="/story#legend">h</a>', '<a href="mailto:hello@kingpuck.com">m</a>', '<a href="#top">t</a>'])
    assert.equal(externalLinks(a), a);
});
