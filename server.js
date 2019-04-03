const express = require('express');
const shortid = require('shortid');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.locals.notes = [];
// app.locals.notes = [
//   {id: shortid.generate(), title: 'gym', noteItems:['suana', 'swim', 'yoga']},
//   {id: shortid.generate(), title: 'groceries', noteItems:['apple sauce']},
//   {id: shortid.generate(), title: 'study', noteItems:['C++', 'simple math']}
// ]

app.listen('3001', () => {
  console.log(`Server is now running at http://localhost:3001`);
});

app.get('/api/notes', (req, res) => {
  res.status(200).json(app.locals.notes);
});

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { notes } = app.locals;
  const note = notes.find(note => note.id === id);
  if (!note) return res.sendStatus(404);
  res.status(200).json(note);
});

app.post('/api/notes', (req, res) => {
  const { title, itemsList } = req.body;
  const id = shortid.generate();
  const newNote = { id, title, itemsList };
  if ( !id || !title) return res.status(422).json({ error: 'Error posting note.' });
  app.locals.notes.push(newNote);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const note = req.body;
  const noteIdx = app.locals.notes.findIndex(note => note.id == id);
  if (noteIdx === -1) return res.status(404).json('Note not found.');
  app.locals.notes.splice(noteIndex, 1, note);
  return res.status(200).json(app.locals.notes[noteIdx]);
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { notes } = app.locals;
    const noteIdx = notes.findIndex(note => note.id == id);
    if (noteIdx === -1) return res.status(404).json('Note not found.');
    notes.splice(noteIdx, 1);
    return res.sendStatus(204);
});
