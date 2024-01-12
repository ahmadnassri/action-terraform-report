import { URL, fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import { join } from 'path'

import { test } from 'tap'

const root = fileURLToPath(new URL('./', import.meta.url))

test('context', async assert => {
  // set up
  process.env.GITHUB_REPOSITORY = 'foo/bar'
  process.env.GITHUB_SHA = 'sha'
  process.env.GITHUB_RUN_ID = '1000'

  const fixture = await readFile(join(root, 'fixtures/comment.md'))

  const { default: report } = await import('../lib/report.js')

  const data = {
    showPlan: 'true',
    showDiff: 'true',
    textContent: 'foobar',
    diff: {
      patches: ['foo'],
      summary: { create: 0, update: 1, delete: 0 }
    },
    customHeader: ':robot: *Terraform Report* - This is a custom header'
  }

  report(data)

  assert.equal(data.body, fixture.toString())
})

test('comment maximum length exceeded', async assert => {
  // set up
  process.env.GITHUB_REPOSITORY = 'foo/bar'
  process.env.GITHUB_SHA = 'sha'
  process.env.GITHUB_RUN_ID = '1000'

  const fixture = await readFile(join(root, 'fixtures/commentMaximumLength.md'))

  const { default: report } = await import('../lib/report.js')

  const commentMaximumLength = 65536

  const data = {
    showPlan: 'true',
    showDiff: 'true',
    textContent: new Array(commentMaximumLength + 1).join( 'x' ),
    diff: {
      patches: ['foo'],
      summary: { create: 0, update: 1, delete: 0 }
    },
    customHeader: ':robot: *Terraform Report* - This is a custom header'
  }

  report(data)

  assert.equal(data.body, fixture.toString())
})
