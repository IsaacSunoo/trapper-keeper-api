import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid';

describe('/api', () => {
  let notes;
  beforeEach(() => {
    notes = [
      { id: '1', title: 'Title', itemsList: ['item1', 'item2', 'item3'] },
      { id: '2', title: 'Title', itemsList: ['item1', 'item2', 'item3'] },
      { id: '3', title: 'Title', itemsList: ['item1', 'item2', 'item3'] }
    ];
    app.locals.notes = notes;
  });

  describe('get /notes', () => {
    it('should return a 200 status with the notes array', async () => {
      const response = await request(app).get('/api/notes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes);
    });
  });

  describe('get /notes/:id', () => {
    it('should return a 200 status with the note', async () => {
      const response = await request(app).get('/api/notes/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(notes[0]);
    });

    it('should return a 404 status if the note does not exist', async () => {
      const response = await request(app).get('/api/notes/5');
      expect(response.status).toBe(404);
    });
  });

  describe('post /notes', () => {
    it('should return a status code 201 and a new note with id if successful', async () => {
      const note = { title: 'new note', itemsList: ['item1', 'item2', 'item3'] };
      shortid.generate = jest.fn().mockImplementation(() => 10);
      expect(notes.length).toBe(3);

      const response = await request(app).post('/api/notes').send(note);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 10, ...note });
      expect(notes.length).toBe(4);
    });

    it('should return a status code 422, response message, and array of same length if not successful', async () => {
      const note = { itemsList: ['item1', 'item2', 'item3'] };
      shortid.generate = jest.fn().mockImplementation(() => 10);
      expect(notes.length).toBe(3);

      const response = await request(app).post('/api/notes').send(note);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({"error": "Error posting note."});
      expect(notes.length).toBe(3);
    });
  });

  describe('put /notes/:id', () => {
    it.skip('should return a status code 200 and a new note with id if successful', async () => {
      let newNotes = [
        { id: '1', title: 'NEW', itemsList: ['item1', 'item2', 'item3'] },
        { id: '2', title: 'Title', itemsList: ['item1', 'item2', 'item3'] },
        { id: '3', title: 'Title', itemsList: ['item1', 'item2', 'item3'] }
      ];
      const newNote = { id: '1', title: 'NEW', itemsList: ['item1', 'item2', 'item3'] }
      
      const response = await request(app).put('/api/notes/1').send(newNote);
      expect(response.status).toBe(200);
      expect(app.locals.notes).toEqual(newNotes);
    });

    it('should return a status code 404 and response message if not successful', async () => {
      const newNote = { title: 'NEW', itemsList: ['item1', 'item2', 'item3'] }
      const response = await request(app).put('/api/notes/6').send(newNote);

      expect(response.status).toBe(404);
      expect(response.body).toBe('Note not found.');
    });
  });

  describe('delete /notes/:id', () => {
    it('should return a status of 204 if the pet exists', async () => {
      const response = await request(app).delete('/api/notes/2');
      expect(response.status).toBe(204);
    });

    it('should return a 404 status if the note does not exist', async () => {
      const response = await request(app).delete('/api/notes/5');
      expect(response.status).toBe(404);
      expect(response.body).toBe('Note not found.');
    });
  });
});