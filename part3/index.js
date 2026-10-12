const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = 3001;

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.use(express.json());
app.use(morgan('tiny'));
morgan.token('type', function(req, res){return req.headers['content-type']});

const generatedId = () => {
    const idGenerated = Math.floor(Math.random() * 10000) + 1;
    return idGenerated;
}

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the page</h1>');
});

app.get('/info', (req, res) => {
    const totalPerson = persons.length;
    const currenTime = new Date();
    res.send(`<p>Phoneboos has info for ${totalPerson} people</p>
              <p>${currenTime}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    
    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name o number missing'
        });
    }

    if(persons.some(p => p.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
 
    const person = {
        id: generatedId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);

    res.json(person);
})

app.get('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    const person = persons.find(person => person.id === id);
    console.log(person);

    if(person){
        res.json(person);
    }else{
        res.status(404).end('Persona no encontrada');
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    persons = persons.filter(person => person.id !== id);
    return res.status(204).end();
});


app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`);
})