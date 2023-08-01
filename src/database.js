import fs from 'fs/promises'
import { processCsv } from './process_csv.js'
import { randomUUID } from 'node:crypto'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    processCsv()
      .then(data => {
        data.forEach ((item) => {
          const task = {
            id: randomUUID(),
            title: item.title,
            description: item.description,
            completed_at: null,
            created_at: new Date(),
            updated_at: new Date()
          }
          this.insert('tasks', task)
        })
      })
    }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          if (value !== null) {
            return row[key].toLowerCase().includes(value.toLowerCase())
          }
        })
      })
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, completed_at, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      if (completed_at) {
        const completed = this.#database[table][rowIndex]['completed_at'] ? null : completed_at
        this.#database[table][rowIndex]['completed_at'] = completed
      } else {
        Object.entries(data).forEach(([key, value]) => {
          if (value) {
            this.#database[table][rowIndex][key] = value
          }
        })
      }

      this.#persist()
    } else {
      return 'not_found'
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)

      this.#persist()
    } else {
      return 'not_found'
    }
  }
}
