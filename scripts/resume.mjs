import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFile, readFile, readdir } from 'node:fs/promises';

// This supplied software resume is the single source for every public download.
const root = new URL('../', import.meta.url);
const source = new URL('Jeffrey_Dai_Software_Resume.pdf', root);
const legacy = new URL('public/resume.pdf', root);
const fingerprint = bytes => createHash('sha256').update(bytes).digest('hex');
const expected = await readFile(source);
assert.equal(expected.subarray(0, 5).toString(), '%PDF-', 'The software resume must be a PDF.');

if (process.argv[2] === 'prepare') {
  // Preserve old bookmarks while the page uses Vite's versioned asset URL.
  await copyFile(source, legacy);
  console.log('Prepared the software resume for legacy download links.');
} else if (process.argv[2] === 'verify') {
  const assets = new URL('dist/assets/', root);
  const names = await readdir(assets);
  const resumes = names.filter(name => /^Jeffrey_Dai_Software_Resume-[\w-]+\.pdf$/.test(name));
  assert.equal(resumes.length, 1, 'The build must contain one versioned software resume.');
  for (const file of [legacy, new URL('dist/resume.pdf', root), new URL(resumes[0], assets)]) {
    assert.equal(fingerprint(await readFile(file)), fingerprint(expected), `${file.pathname} differs from the supplied software resume.`);
  }
  const entryNames = names.filter(name => /^index-.*\.js$/.test(name));
  assert.equal(entryNames.length, 1, 'Expected one application entry.');
  const entry = await readFile(new URL(entryNames[0], assets), 'utf8');
  assert.ok(entry.includes(resumes[0]), 'The page must link to the versioned software resume.');
  console.log(`Verified source, legacy URL, and versioned download: ${fingerprint(expected)}`);
} else {
  throw new Error('Use prepare before building or verify after building.');
}
