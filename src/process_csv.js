import fs from 'fs'
import { parse } from 'csv-parse'

async function processCsv() {
  const records = []
  const rootPath = new URL('..', import.meta.url).pathname

  const parser = fs
    .createReadStream(`${rootPath}/data.csv`)
    .pipe(parse({
      delimiter: ',',
      columns: true
    }))

  for await (const record of parser) {
    const title = record.title
    const description = record.description

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      }
    })
      .then((response) => console.log(response.json()))
  }
}

processCsv()
