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

// remove stale comment
if (data.removeStaleReports === 'true') await stale(data)

// post new comment
post(data)
