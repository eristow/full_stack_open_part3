const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const password = process.env.DB_PASS;

if (process.argv.length === 3 || process.argv.length > 4) {
  console.log(
    'Please provide the name and number as an argument: node mongo.js <name> <number>',
  );
  process.exit(1);
}

const url = `mongodb+srv://evan321:${password}@cluster0.e3cum.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 4) {
  const name = process.argv[2];
  const number = process.argv[3];

  const person = new Person({
    name,
    number,
  });

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
