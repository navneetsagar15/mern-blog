const express = require('express');
// // new
// const mongodb = require("mongodb");
const app = express();
//new
// const connectionUrl = "mongodb://localhost:27017";
// const client= new mongodb.MongoClient(connectionUrl)

const { MngoClient } = require("mongodb");


// client.connect().then(() => console.log("Data connection succesful")).catch((error) => console.log(error))


const PORT = process.env.PORT || 8000;

// to be add in database in terminal
// const articlesInfo = {
//     "learn-react":{
//         comments: [],
//     },
//     "learn-node":{
//         comments: [],
//     }, 
//     "my-thoughts-on-learning-react":{
//         comments: [],
//     },  
// };

// Initialize middleware
// we use to have to install body parser but now it is a built in middleware in express
// function of express. it parses incoming JSON payload

app.use(express.json({ extended: false }));

// just a test routre for now
// app.get('/', (req, res) => res.send("Hello world!"));
// app.post('/', (req, res) => res.send(`Hello ${req.body.name}`));
// app.get("/hello/:name", (req, res) => res.send(`Hello ${req.params.name}`));

const withDB = async(operations, res) =>{
try { const articleName = req.params.name;
    const client =  await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db("mernblog");
    operations(db);
    client.close();

    }   catch(error) {
        res.status(500).json({message:"Error connecting database", error});
    }

}

app.get('/api/articles/:name', async (req, res) =>{
    withDB(async (db) => {
const articleName = req.params.name;
        const articleInfo =  await db
            .collection('articles')
            .findOne({name: articleName});
            res.status(200).json(articleInfo);

    }, res)

        

});

app.post('/api/articles/:name/add-comments', (req, res) => {
    const {username, text} = req.body
    const articleName = req.params.name;
    // articlesInfo[articleName].comments.push({username, text});
    // res.status(200).send(articlesInfo[articleName]);

    withDB(async (db) =>{
        const articleInfo = await db
        .collection('articles')
        .findOne({name: articleName});
        await db.collection('articles').updateOne(
            {name: articleName},
            {
                $set: {
                    comments: articleInfo.comments.concat({username, text}),
                },
            }
        );
        const updateArticleInfo = await db
            .collection('articles')
            .findOne({name: articleName})
        res.status(200).json(updateArticleInfo);
    }, res);
});



app.listen(PORT, () => console.log(`Server started at port ${PORT}`));






