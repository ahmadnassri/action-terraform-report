import { URL, fileURLToPath } from 'url'
import { join } from 'path'

import { test } from 'tap'

const root = fileURLToPath(new URL('./', import.meta.url))

test('context with pr-number input and no pull request event', async assert => {
  process.env['INPUT_SHOW-DIFF'] = 'false'
  process.env['INPUT_SHOW-PLAN'] = 'true'
  process.env['INPUT_SHOW-HEADER'] = 'true'
  process.env['INPUT_SHOW-FOOTER'] = 'true'
  process.env['INPUT_SHOW-NO-CHANGES'] = 'true'
  process.env['INPUT_GITHUB-TOKEN'] = 'abc'
  process.env['INPUT_REMOVE-STALE-REPORTS'] = 'true'
  process.env['INPUT_CUSTOM-HEADER'] = 'abc'
  process.env['INPUT_CUSTOM-FOOTER'] = 'abc'
  process.env['INPUT_PR-NUMBER'] = '42'

  process.env['INPUT_TERRAFORM-TEXT'] = join(root, 'fixtures/terraform.txt')
  process.env['INPUT_TERRAFORM-JSON'] = join(root, 'fixtures/terraform.json')

  process.env.GITHUB_EVENT_PATH = join(root, 'fixtures/push.payload.json')

  const { default: context } = await import('../lib/context.js')
  const data = context()

  assert.equal(data.prNumber, 42)
})
