import github from '@actions/github'

export default async function (data) {
  const octokit = github.getOctokit(data.token)

  // update PR
  await octokit.issues.createComment({
    ...github.context.repo,
    issue_number: github.context.payload.pull_request.number,
    body
  })
}
