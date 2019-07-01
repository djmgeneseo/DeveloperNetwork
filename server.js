const express = require('express');
const connectDB = require(`./config/db`);

const app = express();

// CONNECT DATABASE
connectDB();

app.get('/', (req, res) => res.send(`API RUNNING`));

// DEFINE ROUTES
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Looks for environment variable to use. Used by heroku. Defaults to 5000 for local dev.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));