// packages
const { test } = require('tap')

// module
const parse = require('../lib/parse.js')

const fixture = {
  resource_changes: [
    {
      address: "module.foo.bar",
      change: {
        actions: ["no-op"],
        before: {
          foo: 'bar'
        },
        after: {
          foo: 'bar'
        }
      }
    },
    {
      address: "module.foo.baz",
      change: {
        actions: ["update"],
        before: {
          foo: 'bar'
        },
        after: {
          foo: 'baz'
        }
      }
    }
  ]
}

const expected = [`Index: module.foo.baz
===================================================================
--- module.foo.baz
+++ module.foo.baz
@@ -1,1 +1,1 @@
-foo: bar
+foo: baz
`]

test('plan -> has changes', assert => {
  assert.plan(2)

  const patches = parse(fixture)

  assert.equal(patches.length, 1)
  assert.same(patches, expected)
})
