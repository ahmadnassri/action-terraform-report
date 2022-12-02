/* eslint-disable camelcase */

import core from '@actions/core'
import { context } from '@actions/github'

export default function () {
  // parse inputs
  const inputs = {
    token: core.getInput('github-token'),
    showDiff: core.getInput('show-diff'),
    showPlan: core.getInput('show-plan'),
    textPath: core.getInput('terraform-text'),
    jsonPath: core.getInput('terraform-json'),
    removeStaleReports: core.getInput('remove-stale-reports'),
    customHeader: core.getInput('custom-header')
  }

  // extract relevant variables
  const { payload: { pull_request } } = context

  // exit early
  if (!inputs.textPath || !inputs.jsonPath || !inputs.token) {
    core.error('Missing required inputs')
    process.exit(1)
  }

  // exit early
  if (!pull_request) {
    core.warning('not a pull request. exiting.')
    process.exit(0)
  }

  // exit early
  if (pull_request.state !== 'open') {
    core.warning('action triggered on a closed pull request')
    process.exit(0)
  }

  return inputs
}
