const core = require('@actions/core')
const github = require('@actions/github')

const parse = require('./lib/parse.js')

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
const { payload: { pull_request } } = github.context

// exit early
if (pull_request.state !== 'open') {
  core.setFailed('action triggered on a closed pull request')
  process.exit(1)
}

// load terraform plan JSON
const plan = require(inputs.plan)

const changes = parse(plan)

const fences = '```'

const octokit = github.getOctokit(inputs.token)

const body = changes.map(patch => `${fences}diff\n${patch}\n${fences}`)

// update PR
octokit.pulls.update({
  ... github.context.repo,
  pull_number: pull_request.number,
  body: body.join('\n')
})
