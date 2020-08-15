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
    }
  ]
}

const expected = []

test('plan -> no changes', assert => {
  assert.plan(2)

  const patches = parse(fixture)

  assert.equal(patches.length, 0)
  assert.same(patches, expected)
})
