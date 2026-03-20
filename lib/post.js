import { getOctokit, context }  from '@actions/github'

export default async function ({ token, body }) {
  const octokit = getOctokit(token)

  // update PR
  await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: context.payload.pull_request.number,
    body
  })
}
