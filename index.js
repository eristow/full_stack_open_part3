const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/person');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
morgan.token('reqBody', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :reqBody',
  ),
);

const checkValidPerson = (res, body) => {
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'name missing',
    });
  }
  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number missing',
    });
  }
  //TODO: add uniqueness check later
  // if (Person.find({ name: body.name })) {
  //   return res.status(400).json({
  //     error: 'name must be unique',
  //   });
  // }
};

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(person => {
      res.json(person);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person);
    })
    .catch(error => next(error));
});

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(person => {
      res.send(
        `<div>
          <p>Phonebook has info for ${person.length} people</p>
          <p>${new Date()}</p>
        </div>`,
      );
    })
    .catch(error => next(error));
});

//TODO: fix add person with same name
app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  checkValidPerson(res, body);

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(res => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
