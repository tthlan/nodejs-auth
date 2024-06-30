const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);

const PORT2 = 3001;

app.listen(PORT2, () => {
  console.log(`Server test started on port ${PORT2}`);
});

module.exports = app;