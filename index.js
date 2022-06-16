require('dotenv').config();

const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors")

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(morgan("tiny"));

const Person = require('./models/person.js')



let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
    {
        id: 5,
        name: "Ann Dänner",
        number: "055-123-4567"
    }
]

function generateId() {
    const id = Math.floor(Math.random() * 100000);
    return id;
}

function doesNameAlreadyExist(name) {
    let found = persons.find(person => person.name === name);
    if (found) {
        return true;
    }
    return false;
}

app.get("/", function(req, res) {
    res.send("<h1>Full Stack open part 3, yey!</h1>");
})

app.get("/api/persons", function(req, res) {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

app.get("/info", function(req, res) {
    let time = Date();
    let numPersons = persons.length;

    res.send(`<p>Phonebook has info for ${numPersons} people<br><br>${time}</p>`);
})

app.get("/api/persons/:id", function(req, res) {
    const id = Number(req.params.id);
    let person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete("/api/persons/:id", function(req, res) {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
})

app.post("/api/persons", function(req, res) {
    const body = req.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson);
    })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})