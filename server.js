const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(console.error)

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})