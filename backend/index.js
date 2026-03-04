require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', (request, response) => {
    if (request.method === 'POST' || request.method === 'PUT') {
        return JSON.stringify(request.body)
    }
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(":method :url :status :response-time :body"))


// let persons = [
//     {
//         "id": "1",
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": "2",
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": "3",
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": "4",
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})

app.get('/info', (request, response) => {
    const currentDate = new Date();
    const gmtString = currentDate.toUTCString();

    Person.countDocuments({}).then(count => {
        response.send(`<div> 
        <p>The phonebook has info for ${count} people  </p> 
        <p> ${gmtString} </p> 
        </div>`)
    })
        .catch(error => {
            response.status(500).send({ error: 'Database error' });
        })


})

app.get('/api/persons/:id', (request, response, next) => {

    // const id = request.params.id
    // const person = persons.find(p => p.id === id)
    // if (person) {
    //     response.json(person)
    // }
    // else {
    //     response.status(404).end()
    // }

    console.log(request.params.id)
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                // id not found
                response.status(404).end()
            }
        })
        .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

    // const id = request.params.id
    // persons = persons.filter(p => p.id !== id)

    // response.status(204).end()
})

app.put('/api/persons/:id', (request, response, next) => {
    // const id = request.params.id
    // const changedPerson = request.body
    // if (!changedPerson.number) {
    //     return response.status(400).json({
    //         error: 'content missing'
    //     })
    // }
    // console.log(changedPerson)
    // persons = persons.map(p => p.id === id ? changedPerson : p)

    // response.json(changedPerson)

    const { name, number } = request.body
    if (!number) {
        return response.status(400).json({
            error: 'content missing'
        })

    }


    console.log(number)

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404)
            }
            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    // const randomId = Math.floor(Math.random() * 100000)

    const body = request.body
    // console.log(person)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    // const found = persons.find(p => p.name === person.name)

    // if (found) {
    //     return response.status(400).json({
    //         error: 'name is already in phonebook'
    //     })
    // }

    // person.id = String(randomId)

    // persons = persons.concat(person)

    // response.json(person)

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
