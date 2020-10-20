const core = require('@actions/core')
const github = require('@actions/github')
const unidiff = require('@ahmadnassri/terraform-unidiff')

// parse inputs
const inputs = {
  plan: core.getInput('terraform-plan', { required: true }),
  token: core.getInput('github-token', { required: true })
}

// error handler
function errorHandler (err) {
  console.error(err)
  core.setFailed(`Unhandled error: ${err}`)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

// extract relevant variables
const { runId, payload: { pull_request } } = github.context

// exit early
if (pull_request.state !== 'open') {
  core.setFailed('action triggered on a closed pull request')
  process.exit(1)
}

// load terraform plan JSON
const plan = require(inputs.plan)

// process file
const patches = unidiff(plan)

const octokit = github.getOctokit(inputs.token)

const diff = patches.map(patch => `\`\`\`diff\n${patch}\n\`\`\``).join('\n\n')

// update PR
octokit.issues.createComment({
  ...github.context.repo,
  issue_number: pull_request.number,
  body: `
  #### Run #[${runId}](https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${runId}) from ${github.context.sha} on \`${github.context.ref}\`
  <details><summary>Show Diff</summary>

  ${diff}
  </details>
  `
})
