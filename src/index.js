const express = require('express')
const routes = require('./api/routes/index')
const config = require('./config/index')
const app = express()

const port = config.endPointBasePort

app.use(express.json())
app.use(routes)


app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
