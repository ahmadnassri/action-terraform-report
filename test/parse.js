import { URL, fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { test } from 'tap'

import parse from '../lib/parse.js'

const root = fileURLToPath(new URL('./', import.meta.url))

test('parse', async assert => {
  const data = {
    textPath: join(root, 'fixtures/terraform.txt'),
    jsonPath: join(root, 'fixtures/terraform.json')
  }

  await parse(data)

  assert.match(data.jsonData, {
    format_version: 'xxx',
    terraform_version: 'yyy',
    resource_changes: []
  })

  assert.same(data.diff.patches, [`Index: module.foo.baz
===================================================================
--- module.foo.baz
+++ module.foo.baz
@@ -1,1 +1,1 @@
-foo: bar
+foo: baz
`])

  assert.match(data.textContent.toString(), 'foobar')
})
