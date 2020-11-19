require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response, request } = require('express')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan((tokens, req, res) => {
    const isPost = tokens.method(req) === 'POST';
    const reqBody = JSON.stringify(isPost ? req.body : '')
    return ([
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        reqBody
    ].join(' '))
}))
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "044-1234567",
        "id": 1
    },
    {
        "name": "Ville Virtanen",
        "number": "055-1234567",
        "id": 2
    },
    {
        "name": "Kaisa Virtanen",
        "number": "040-1234567",
        "id": 3
    },
    {
        "name": "Jaakko Nieminen",
        "number": "010-456789123",
        "id": 4
    }
]

app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            const info = `<div<p>Phonebook has info for ${persons.length} people<br/><br/>${new Date()}</p></div>`
            response.send(info);
        })
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person);
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save()
        .then(savedNote => savedNote.toJSON())
        .then(savedAndFormattedNote => {
            response.json(savedAndFormattedNote)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})