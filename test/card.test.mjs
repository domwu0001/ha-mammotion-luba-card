import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/ha-mammotion-luba-card.js', import.meta.url), 'utf8');

test('registers the custom card and editor', () => {
  assert.match(source, /customElements\.define\("ha-mammotion-luba-card"/);
  assert.match(source, /customElements\.define\("ha-mammotion-luba-card-editor"/);
});

test('uses Mammotion lawn mower actions and cancel service', () => {
  assert.match(source, /_callLawn\("start_mowing"\)/);
  assert.match(source, /_callLawn\("pause"\)/);
  assert.match(source, /_callLawn\("dock"\)/);
  assert.match(source, /_service\("mammotion", "cancel_job"/);
});

test('provides the configured sensor suffixes', () => {
  for (const suffix of ['battery_percent', 'progress', 'area', 'activity_mode', 'self_check']) {
    assert.ok(source.includes(suffix), `missing ${suffix}`);
  }
});
