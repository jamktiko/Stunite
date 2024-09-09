require('dotenv').config();
const app = express();
const express = require('express');
const cors = require('cors');
const http = require('http');
app.use(express.json());
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  response.status(500).json({ error: 'Something went wrong' });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
