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

app.get("/", (req, res) => {
    res.send("<h1>Full Stack open part 3, yey!</h1>");
})

app.get("/api/persons", function(req, res) {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

app.get("/info", (req, res) => {
    let time = Date();
    let numPersons = persons.length;

    res.send(`<p>Phonebook has info for ${numPersons} people<br><br>${time}</p>`);
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            next(error);
        })
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
})

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
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

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;

    const person = {
        number: body.number,
    };

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error));

})
const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})