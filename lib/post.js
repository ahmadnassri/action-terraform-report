import { getOctokit, context }  from '@actions/github'

export default async function ({ token, body, prNumber }) {
  const octokit = getOctokit(token)

  // update PR
  await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: prNumber,
    body
  })
}
