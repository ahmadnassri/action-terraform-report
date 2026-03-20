import { warning } from '@actions/core'
import { getOctokit, context } from '@actions/github'

/* eslint-disable camelcase */
export default async function (data) {
  const octokit = getOctokit(data.token)

  const { repo, payload: { pull_request: { number: issue_number } } } = context

  // get issue comments
  const { data: results } = await octokit.rest.issues.listComments({ ...repo, issue_number })

  // get action comments
  // filter out comments that include the unique identifier but not the run signature to get stale comments from previous runs
  const comments = results.filter(c => c.body.includes(data.uniqueIdentifier) && !c.body.includes(data.runSignature))

  // remove existing comments
  for (const { id: comment_id } of comments) {
    try {
      await octokit.rest.issues.deleteComment({ ...repo, issue_number, comment_id })
    } catch (error) {
      warning(`Could not delete comment: ${comment_id}`)
    }
  }
}
