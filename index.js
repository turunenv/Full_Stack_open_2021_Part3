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
    Person.find({}).then(persons => {
        const numPersons = persons.length;
        res.send(`<p>Phonebook has info for ${numPersons} people<br><br>${time}</p>`);
    })
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

app.post("/api/persons", (req, res, next) => {
    const body = req.body;

    Person.find({ name: body.name })
        .then(existingPerson => {
            if (!existingPerson) {
                return res.status(400).send({ error: 'person already exists in the database' })
            }
            const person = new Person({
                name: body.name,
                number: body.number,
            })
        
            person.save()
                .then(savedPerson => {
                    res.json(savedPerson);
                })
                .catch(error => next(error));

        })  
})

app.put("/api/persons/:id", (req, res, next) => {
   const { number } = req.body;

    
    Person.findByIdAndUpdate(req.params.id, { number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error));

})
const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})