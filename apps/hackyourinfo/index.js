const express = require('express')
const fs = require('fs-extra')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const rootDir = path.resolve(__dirname)
const infoDir = path.join(rootDir, 'info')

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.post('/:name.json', async (request, response) => {
  try {
    const filename = path.join(infoDir, `${request.params.name}.json`)
    await fs.ensureDir(infoDir)
    await fs.writeFile(filename, JSON.stringify(request.body, null, 2))
    response.statusCode = 200
    response.json({ ok: true })
  } catch (error) {
    response.statusCode = 500
    response.json({ error: "An error occurred" })
    console.error(error)
  }

  response.end()
})

app.get('/_all.json', async (request, response) => {
  try {
    await fs.ensureDir(infoDir)
    const files = await fs.readdir(infoDir)
    const promises = files.map(file => fs.readFile(path.join(infoDir, file), 'utf8').then(raw => [file, raw]))
    const raws = await Promise.all(promises)

    const result = {}
    for (const [file, raw] of raws) {
      result[file.replace(/\.json$/, '')] = JSON.parse(raw)
    }
    response.json(result)
  } catch (error) {
    response.statusCode = 500
    response.json({ error: "An error occurred" })
    console.error(error)
  }
  response.end()
})

app.get('/:name.json', async (request, response) => {
  try {
    const filename = path.join(infoDir, `${request.params.name}.json`)
    await fs.ensureDir(infoDir)
    const raw = await fs.readFile(filename, 'utf8')
    response.json(JSON.parse(raw))
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.statusCode = 404
      response.json({ error: "File not found" })
    } else {
      response.statusCode = 500
      response.json({ error: "An error occurred" })
      console.error(error)
    }
  }
  response.end()
})

app.delete('/_all.json', async (request, response) => {
  try {
    await fs.emptyDir(infoDir)
    response.json({ ok: true })
  } catch (error) {
    response.statusCode = 500
    response.json({ error: "An error occurred" })
    console.error(error)
  }
  response.end()
})

app.delete('/:name.json', async (request, response) => {
  try {
    await fs.ensureDir(infoDir)
    await fs.unlink(path.join(infoDir, `${request.params.name}.json`))
    response.json({ ok: true })
  } catch (error) {
    if (error.code !== 'ENOENT') {
      response.statusCode = 500
      response.json({ error: "An error occurred" })
      console.error(error)
    } else {
      response.json({ ok: true })
    }
  }
  response.end()
})

app.use((request, response) => {
  response.statusCode = 404
  response.json({ error: "Not found" })
  response.end()
})

app.listen(process.env.PORT || 80)