import github from '@actions/github'

export default async function ({ token, body, pullRequestNumber, owner, repo}) {
  const octokit = github.getOctokit(token)

  // update PR
  await octokit.rest.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: pullRequestNumber,
    body
  })
}
