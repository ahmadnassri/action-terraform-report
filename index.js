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

const data = context()
await parse(data)
report(data)

if (data.removeStaleReports === 'true') {
  await stale(data)
}
post(data)
