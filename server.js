
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('✅ Taily Server with In-Memory Auth is LIVE!');
});

app.listen(PORT, () => {
  console.log(`✅ Taily Server running on port ${PORT}`);
});
