import { URL, fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { test } from 'tap'

const root = fileURLToPath(new URL('./', import.meta.url))

test('context', async assert => {
  // set up
  process.env['INPUT_SHOW-DIFF'] = 'true'
  process.env['INPUT_SHOW-PLAN'] = 'true'
  process.env['INPUT_GITHUB-TOKEN'] = 'abc'

  process.env['INPUT_TERRAFORM-TEXT'] = join(root, 'fixtures/terraform.txt')
  process.env['INPUT_TERRAFORM-JSON'] = join(root, 'fixtures/terraform.json')
  process.env['GITHUB_EVENT_PATH'] = join(root, 'fixtures/payloads/pull_request/opened.payload.json')

  process.env.GITHUB_REPOSITORY = 'foo/bar'
  process.env.GITHUB_SHA = 'sha'
  process.env.GITHUB_REF = 'ref'
  process.env.GITHUB_RUN_ID = '1000'

  const fixture = await readFile(join(root, 'fixtures/comment.md'))

  const { default: report } = await import('../lib/report.js')

  const data = {
    showPlan: 'true',
    showDiff: 'true',
    textContent: 'foobar',
    patches: ['foo'],
    summary: { create: 0, update: 1, delete: 0 }
  }

  report(data)

  assert.equal(data.body, fixture.toString())
})
