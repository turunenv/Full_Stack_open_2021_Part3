const mongoose = require('mongoose')

const ARGLEN = process.argv.length

if (ARGLEN < 3 || ARGLEN == 4) {
    console.log("To add an entry to the phonebook: node mongo.js <password> <name> <phonenumber>");
    console.log("To list existing entries: node mongo.js <password>");
    process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://turunenv_1996:${password}@cluster0.x40pt.mongodb.net/phoneapp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);

//handle adding new document to database when 3 cli-arguments were provided
if (ARGLEN > 4) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close();
    })

} else {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        })
        mongoose.connection.close();
    })
}

