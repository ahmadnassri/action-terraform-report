#!/usr/bin/env node

import core from '@actions/core'

import context from './lib/context.js'
import parse from './lib/parse.js'
import report from './lib/report.js'
import post from './lib/post.js'
import stale from './lib/stale.js'

// error handler
function errorHandler (err) {
  console.error(err)
  core.error(`Unhandled error: ${err}`)
  process.exit(1)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

// grab action context
const data = context()

// parse plan content
await parse(data)

// generate report markdown
report(data)

// check if there are no changes
const hasChanges = data.diff.summary.create > 0 || data.diff.summary.update > 0 || data.diff.summary.delete > 0

// remove stale comment
if (data.removeStaleReports) await stale(data)

// skip posting if no changes and show-no-changes is false
if (!hasChanges && !data.showNoChanges) process.exit(0)

// post new comment
post(data)
