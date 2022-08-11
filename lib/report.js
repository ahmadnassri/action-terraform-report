import github from '@actions/github'

export default function (data) {
  // extract relevant variables
  const { summary, patches, textContent } = data
  const { runId, repo, sha, ref } = github.context

  data.body = `#### Run #[${runId}](https://github.com/${repo.owner}/${repo.repo}/actions/runs/${runId}) from ${sha} on \`${ref}\`

##### Plan: \`${summary.create}\` to add, \`${summary.update}\` to change, \`${summary.delete}\` to destroy

`

  if (data.showPlan === 'true') {
    data.body += `<details><summary>Terraform Plan</summary>

\`\`\`terraform
${textContent}
\`\`\`
</details>

`
  }

  if (data.showDiff === 'true') {
    const diff = patches.map(patch => `\`\`\`diff\n${patch}\n\`\`\``).join('\n\n')

    data.body += `<details><summary>Show Diff</summary>

${diff}
</details>
`
  }
}
