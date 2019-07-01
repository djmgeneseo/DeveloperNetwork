const express = require('express');

const app = express();

app.get('/', (req, res) => res.send(`API RUNNING`));

// Looks for environment variable to use. Used by heroku. Defaults to 5000 for local dev.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));