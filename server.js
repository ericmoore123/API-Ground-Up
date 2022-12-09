const express = require('express');
const app = express();
const PORT = process.env.PORT || 8800;

app.get('/', (req, res, next) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log('Server running on port: ', PORT);
});