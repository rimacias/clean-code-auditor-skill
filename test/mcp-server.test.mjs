import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { validateDirectory, validateSubPath } from '../mcp-server.mjs';

test('Security: validateDirectory accepts valid directories and rejects nonexistent/invalid', () => {
  const valid = validateDirectory(process.cwd());
  assert.equal(valid, process.cwd());

  assert.throws(
    () => validateDirectory('/nonexistent/path/dir/123'),
    /Directory does not exist|Path is not a directory/
  );

  // Rejects files as directories
  const tmpFile = path.join(os.tmpdir(), 'auditor-not-a-dir.txt');
  fs.writeFileSync(tmpFile, 'hello');
  try {
    assert.throws(
      () => validateDirectory(tmpFile),
      /Path is not a directory/
    );
  } finally {
    fs.rmSync(tmpFile, { force: true });
  }
});

test('Security: validateSubPath prevents path traversal attacks', () => {
  const base = process.cwd();

  // Valid relative sub-path
  const valid = validateSubPath(base, 'package.json');
  assert.equal(valid, path.join(base, 'package.json'));

  // Path traversal escaping base
  assert.throws(
    () => validateSubPath(base, '../../etc/passwd'),
    /Access denied: path escapes the target directory/
  );

  // Null byte injection
  assert.throws(
    () => validateSubPath(base, 'package.json\0.png'),
    /null bytes not allowed/
  );
});
