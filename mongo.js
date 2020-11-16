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
    number: Number
})

const Person = mongoose.model('Person', personSchema)

Note.find({ important: false }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})

const person = new Person({
    id: generateId(0, 10000),
    name: String,
    number: Number
})

person.save().then(response => {
    console.log('Person saved!')
    mongoose.connection.close()
})

const generateId = (min, max) => {
    return Number((Math.random() * (max - min) + min).toFixed(0))
}