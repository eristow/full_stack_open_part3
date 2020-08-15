const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
morgan.token('reqBody', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :reqBody',
  ),
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

const maxRand = 1000000;

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(maxRand));
};

const checkValidPerson = (res, body) => {
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name missing',
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }
  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
};

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/api/info', (req, res) => {
  res.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`,
  );
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  checkValidPerson(res, body);

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
