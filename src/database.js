const mongoose = require('mongoose');

const user = 'sfuriove';
const password = '6YEboAXTF4cw5oSD';
const dbname = 'notasdb';
const uri = `mongodb+srv://${user}:${password}@cluster0.cfbc2.mongodb.net/${dbname}?retryWrites=true&w=majority`;

console.log("uri---->" , uri)
mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
    ).then(() => console.log('DB conectada'))
    .catch(e => console.log(e));

    
