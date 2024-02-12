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
    customHeader: core.getInput('custom-header'),
    repo: core.getInput('repo'),
    owner: core.getInput('owner'),
    pullRequestNumber: core.getInput('pull-request-number')
  }

  // extract relevant variables
  const { payload: { pull_request } } = context

  // exit early
  if (!inputs.textPath || !inputs.jsonPath || !inputs.token || !inputs.pullRequestNumber) {
    core.error('Missing required inputs')
    process.exit(1)
  }

  return inputs
}
