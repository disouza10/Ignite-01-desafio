import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      let { title, description } = req.query
      title = title ? title : null
      description = description ? description : null

      const tasks = database.select('tasks', title || description ? {
        title: title,
        description: description,
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if ([title, description].some((el) => el == null)) {
        return res.writeHead(422).end(JSON.stringify('There must be a title and a description'))
      } else {
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }

        database.insert('tasks', task)

        return res.writeHead(201).end()
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const updateAction = database.update('tasks', id, null, {
        title: title,
        description: description,
      })

      if (updateAction === 'not_found') {
        return res.writeHead(422).end(JSON.stringify('Id not found in database'))
      } else {
        return res.writeHead(204).end()
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const updateAction = database.update('tasks', id, new Date(), null)

      if (updateAction === 'not_found') {
        return res.writeHead(422).end(JSON.stringify('Id not found in database'))
      } else {
        return res.writeHead(204).end()
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const deleteAction = database.delete('tasks', id)

      if (deleteAction === 'not_found') {
        return res.writeHead(422).end(JSON.stringify('Id not found in database'))
      } else {
        return res.writeHead(204).end()
      }
    }
  }
]
