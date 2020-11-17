const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://admin:${password}@cluster0.lcswd.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const generateId = (min, max) => {
    return Number((Math.random() * (max - min) + min).toFixed(0))
}

if (name && number) {
    const person = new Person({
        id: generateId(0, 10000),
        name: name,
        number: number
    })

    person.save()
        .then(response => {
            console.log('Person saved!')
            mongoose.connection.close()
        })
} else {
    Person.find({})
        .then(result => {
            console.log('Phonebook:');
            result.forEach(person => {
                console.log(person.name, person.number);
            })
            mongoose.connection.close()
        })
}