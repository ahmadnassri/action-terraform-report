/* eslint-disable camelcase */

// packages
const core = require('@actions/core')
const github = require('@actions/github')
const unidiff = require('@ahmadnassri/terraform-unidiff')
const { promises: { readFile } } = require('fs')

// parse inputs
const inputs = {
  diff: core.getInput('show-diff'),
  plan: core.getInput('show-plan'),
  text: core.getInput('terraform-text'),
  json: core.getInput('terraform-json'),
  token: core.getInput('github-token')
}

// extract relevant variables
const { runId, payload: { pull_request } } = github.context

// exit early
if (!inputs.text || !inputs.json || !inputs.token) {
  core.error('Missing required inputs')
  process.exit(1)
}

// exit early
if (pull_request.state !== 'open') {
  core.warning('action triggered on a closed pull request')
  process.exit(0)
}

// error handler
function errorHandler (err) {
  console.error(err)
  core.error(`Unhandled error: ${err}`)
  process.exit(1)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

async function main () {
  // load terraform files
  const text = await readFile(inputs.text)
  const json = await readFile(inputs.json)

  // load terraform plan JSON
  const data = JSON.parse(json)

  // process file
  const { summary, patches } = unidiff(data)

  const octokit = github.getOctokit(inputs.token)

  const diff = patches.map(patch => `\`\`\`diff\n${patch}\n\`\`\``).join('\n\n')

  let body = `
#### Run #[${runId}](https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${runId}) from ${github.context.sha} on \`${github.context.ref}\`

##### Plan: \`${summary.create}\` to add, \`${summary.update}\` to change, \`${summary.delete}\` to destroy
  `

  if (inputs.plan) {
    body += `
<details><summary>Terraform Plan</summary>

\`\`\`terraform
${text}
\`\`\`
</details>
`
  }

  if (inputs.diff) {
    body += `
<details><summary>Show Diff</summary>

${diff}
</details>
`
  }

  // update PR
  await octokit.issues.createComment({
    ...github.context.repo,
    issue_number: pull_request.number,
    body
  })
}

main()
