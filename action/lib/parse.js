const { createPatch } = require('diff')
const { safeDump } = require('js-yaml')

module.exports = function (plan) {
  const patches = []

  for (const resource of plan.resource_changes) {
    // skip early
    if (resource.change.actions.includes('no-op')) continue

    // convert to yaml for better visibility
    const before = safeDump(resource.change.before)
    const after = safeDump(resource.change.after)

    const patch = createPatch(resource.address, before, after)

    patches.push(patch)
  }

  return patches
}
