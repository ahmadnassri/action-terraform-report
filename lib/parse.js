import { readFile } from 'fs/promises'

import unidiff from '@ahmadnassri/terraform-unidiff'

export default async function (data) {
// load terraform files
  data.textContent = await readFile(data.textPath)
  data.jsonContent = await readFile(data.jsonPath)

  // load terraform plan JSON
  data.jsonData = JSON.parse(data.jsonContent)

  // process file
  data.diff = unidiff(data.jsonData)
}
