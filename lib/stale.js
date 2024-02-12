import core from '@actions/core'
import github from '@actions/github'

/* eslint-disable camelcase */
export default async function (data) {
  const octokit = github.getOctokit(data.token)

  const issue_number = data.pullRequestNumber
  const owner = data.owner
  const repo = data.repo

  // get issue comments
  const { data: results } = await octokit.rest.issues.listComments({ owner, repo, issue_number })

  // get action comments
  const comments = results.filter(c => c.body.includes(data.header) && !c.body.includes(data.footer))

  // remove existing comments
  for (const { id: comment_id } of comments) {
    try {
      await octokit.rest.issues.deleteComment({ owner, repo, issue_number, comment_id })
    } catch (error) {
      core.warning(`Could not delete comment: ${comment_id}`)
    }
  }
}
