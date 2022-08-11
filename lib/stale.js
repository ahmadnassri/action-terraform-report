import core from '@actions/core'
import github from '@actions/github'

/* eslint-disable camelcase */
export default async function (data) {
  const octokit = github.getOctokit(data.token)

  const { repo, payload: { pull_request: { number: issue_number } } } = github.context

  // get issue comments
  const { data: results } = await octokit.issues.listComments({ ...repo, issue_number })

  // get action comments
  const comments = results.filter(c => c.body.includes(data.header) && !c.body.includes(data.footer))

  // remove existing comments
  for (const { id: comment_id } of comments) {
    try {
      await octokit.rest.issues.deleteComment({ ...repo, issue_number, comment_id })
    } catch (error) {
      core.warning(`Could not delete comment: ${comment_id}`)
    }
  }
}
