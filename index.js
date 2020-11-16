const express = require('express')
const app = express()
var morgan = require('morgan')

app.use(express.json())
app.use(morgan((tokens, req, res) => {
    const isPost = tokens.method(req) === 'POST';
    const reqBody = JSON.stringify(isPost ? req.body : '')
    console.log(tokens);
    return ([
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        reqBody
    ].join(' '))
}))

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
    const info = `<div<p>Phonebook has info for ${persons.length} people<br/><br/>${new Date()}</p></div>`

    response.send(info);
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person);
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const nameExists = persons.find(person => person.name === body.name)


    if (nameExists) {
        return response.status(400).json({
            error: 'Name is already added to the phonebook'
        })
    }

    if (!body.name) {
        return response.status(400).json({
            error: 'Name is required'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'Number is required'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(0, 10000)
    }

    persons = persons.concat(newPerson)

    response.json(newPerson);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = (min, max) => {
    return Number((Math.random() * (max - min) + min).toFixed(0))
}

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)