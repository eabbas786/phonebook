const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})

app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status :response-time :body"))


let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const currentDate = new Date();
    const gmtString = currentDate.toUTCString();
    response.send(`<div> 
        <p>The phonebook has info for ${persons.length} people  </p> 
        <p> ${gmtString} </p> 
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const randomId = Math.floor(Math.random() * 100000)

    const person = request.body
    // console.log(person)

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const found = persons.find(p => p.name === person.name)
    if (found) {
        return response.status(400).json({
            error: 'name is already in phonebook'
        })
    }

    person.id = String(randomId)

    persons = persons.concat(person)

    response.json(person)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
