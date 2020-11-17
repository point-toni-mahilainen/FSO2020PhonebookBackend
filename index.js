require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person);
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = (min, max) => {
    return Number((Math.random() * (max - min) + min).toFixed(0))
}

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})