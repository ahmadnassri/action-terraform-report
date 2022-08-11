import github from '@actions/github'

export default async function ({ token, body }) {
  const octokit = github.getOctokit(token)

  // update PR
  await octokit.issues.createComment({
    ...github.context.repo,
    issue_number: github.context.payload.pull_request.number,
    body
  })
}
