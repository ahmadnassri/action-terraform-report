// internals
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'

// packages
import core from '@actions/core'
import github from '@actions/github'
import unidiff from '@ahmadnassri/terraform-unidiff'

const run = promisify(exec)

// parse inputs
const inputs = {
  text: core.getInput('terraform-text', { required: true }),
  json: core.getInput('terraform-json', { required: true }),
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

// load terraform files
const text = await readFile(inputs.text)
const json = await readFile(inputs.json)

// load terraform plan JSON
const data = JSON.parse(json)

// process file
const patches = unidiff(data)

const octokit = github.getOctokit(inputs.token)

const diff = patches.map(patch => `\`\`\`diff\n${patch}\n\`\`\``).join('\n\n')

// update PR
await octokit.issues.createComment({
  ...github.context.repo,
  issue_number: pull_request.number,
  body: `
  #### Run #[${runId}](https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${runId}) from ${github.context.sha} on \`${github.context.ref}\`

  \`\`\`terraform
  ${text}
  \`\`\`

  <details><summary>Show Diff</summary>

  ${diff}
  </details>
  `
})
