import { test } from 'tap'

const UNIQUE_IDENTIFIER = '<!-- ahmadnassri-action-terraform-report -->'
const RUN_SIGNATURE = '<!-- owner-repo-current-sha-1234 -->'
const OLD_SIGNATURE = '<!-- owner-repo-old-sha-5678 -->'

const data = {
  token: 'test-token',
  prNumber: 42,
  uniqueIdentifier: UNIQUE_IDENTIFIER,
  runSignature: RUN_SIGNATURE
}

const mockContext = { repo: { owner: 'owner', repo: 'repo' } }

function makeOctokit ({ comments = [], onDelete = () => {} } = {}) {
  return {
    paginate: async (_method, _params) => comments,
    rest: {
      issues: {
        listComments: () => {},
        deleteComment: async ({ comment_id }) => onDelete(comment_id)
      }
    }
  }
}

test('stale - uses paginate to fetch all comments', async t => {
  let paginateCalled = false

  const octokit = {
    paginate: async (_method, params) => {
      paginateCalled = true
      t.equal(params.issue_number, 42)
      return []
    },
    rest: { issues: { listComments: () => {}, deleteComment: async () => {} } }
  }

  const { default: stale } = await t.mockImport('../lib/stale.js', {
    '@actions/github': { getOctokit: () => octokit, context: mockContext },
    '@actions/core': { warning: () => {} }
  })

  await stale(data)
  t.ok(paginateCalled)
})

test('stale - only deletes stale comments, not current run or unrelated ones', async t => {
  const deleted = []
  const comments = [
    { id: 1, body: `${UNIQUE_IDENTIFIER}\n${OLD_SIGNATURE}` },     // stale — should be deleted
    { id: 2, body: 'unrelated comment' },                            // not from this action
    { id: 3, body: `${UNIQUE_IDENTIFIER}\n${RUN_SIGNATURE}` }       // current run — should NOT be deleted
  ]

  const { default: stale } = await t.mockImport('../lib/stale.js', {
    '@actions/github': { getOctokit: () => makeOctokit({ comments, onDelete: id => deleted.push(id) }), context: mockContext },
    '@actions/core': { warning: () => {} }
  })

  await stale(data)
  t.same(deleted, [1])
})

test('stale - warning includes error message when delete fails', async t => {
  const warnings = []
  const comments = [{ id: 99, body: `${UNIQUE_IDENTIFIER}\n${OLD_SIGNATURE}` }]

  const octokit = {
    paginate: async () => comments,
    rest: {
      issues: {
        listComments: () => {},
        deleteComment: async () => { throw new Error('Forbidden') }
      }
    }
  }

  const { default: stale } = await t.mockImport('../lib/stale.js', {
    '@actions/github': { getOctokit: () => octokit, context: mockContext },
    '@actions/core': { warning: msg => warnings.push(msg) }
  })

  await stale(data)
  t.equal(warnings.length, 1)
  t.match(warnings[0], '99')
  t.match(warnings[0], 'Forbidden')
})
