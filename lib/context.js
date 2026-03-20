/* eslint-disable camelcase */

import * as core from '@actions/core'
import { context } from '@actions/github'

export default function () {
  // parse inputs
  const inputs = {
    token: core.getInput('github-token'),
    showDiff: core.getBooleanInput('show-diff'),
    showPlan: core.getBooleanInput('show-plan'),
    textPath: core.getInput('terraform-text'),
    jsonPath: core.getInput('terraform-json'),
    removeStaleReports: core.getBooleanInput('remove-stale-reports'),
    showNoChanges: core.getBooleanInput('show-no-changes'),
    customHeader: core.getMultilineInput('custom-header'),
    customFooter: core.getMultilineInput('custom-footer'),
    showHeader: core.getBooleanInput('show-header'),
    showFooter: core.getBooleanInput('show-footer')
  }

  // extract relevant variables
  const { payload: { pull_request } } = context

  // exit early
  /* c8 ignore next 4 */
  if (!inputs.textPath || !inputs.jsonPath || !inputs.token) {
    core.error('Missing required inputs')
    process.exit(1)
  }

  // exit early
  /* c8 ignore next 4 */
  if (!pull_request) {
    core.warning('not a pull request. exiting.')
    process.exit(0)
  }

  // exit early
  /* c8 ignore next 4 */
  if (pull_request.state !== 'open') {
    core.warning('action triggered on a closed pull request')
    process.exit(0)
  }

  return inputs
}
