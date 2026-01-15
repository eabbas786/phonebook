const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://eabbas:${password}@cluster0.ncmujue.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 }) // create connection

//define schema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

//create module
const Person = mongoose.model('Person', personSchema)


if (process.argv.length < 4) {
    // print all persons
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

else {
    // create and save the new person entry
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })

}
