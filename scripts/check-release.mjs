import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('bank.json', 'utf8'));
const repository = process.env.GITHUB_REPOSITORY;
assert.equal(repository, `balanse-finance/${manifest.institutionId}.${manifest.country.toLowerCase()}`);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const previousTag = git('tag', '--list', 'v*', '--sort=-version:refname').split('\n')[0];
const tag = `v${manifest.version}`;
if (previousTag) {
  const previous = JSON.parse(git('show', `${previousTag}:bank.json`));
  if (previousTag === tag) {
    assert.deepEqual(manifest, previous, 'Shipped changes require a bank version bump');
  } else {
    const versions = [previous.version, manifest.version].map(version => version.split('.').map(BigInt));
    const firstDifference = versions[0].findIndex((part, index) => part !== versions[1][index]);
    assert.ok(firstDifference >= 0 && versions[1][firstDifference] > versions[0][firstDifference], 'Bank version must increase');
    for (const entry of manifest.recipes) {
      const old = previous.recipes.find(item => item.templateId === entry.templateId);
      if (old) assert.ok(entry.revision >= old.revision && (entry.sha256 === old.sha256 || entry.revision > old.revision), 'Changed recipes require a higher revision');
    }
  }
} else {
  assert.equal(tag, 'v1.0.0');
}
const publish = previousTag !== tag || git('rev-list', '-1', tag) === git('rev-parse', 'HEAD');
appendFileSync(process.env.GITHUB_OUTPUT, `publish=${publish}\ntag=${tag}\n`);
