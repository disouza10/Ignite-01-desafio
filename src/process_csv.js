import fs from 'fs'
import { parse } from 'csv-parse'

export async function processCsv() {
  const records = []
  const rootPath = new URL('..', import.meta.url).pathname

  const parser = fs
    .createReadStream(`${rootPath}/data.csv`)
    .pipe(parse({
      delimiter: ',',
      columns: true
    }))

  for await (const record of parser) {
    records.push(record)
  }

  return records
}
