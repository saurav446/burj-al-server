const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');  
const admin = require('firebase-admin');

const port = 5000;

const app = express()
app.use(cors());
app.use(bodyParser.json());

 

const serviceAccount = require("./ema-jhon-54b70-firebase-adminsdk-pt667-9a002f374e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
 

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://burjAL:saurav12345@cluster0.5gwiv.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booking = client.db("burjAlArab").collection("booking");
        app.post('/addBooking', (req, res) => {
            const newBooking = req.body;
            booking.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
            console.log(newBooking)
        }) 


        app.get('/booking',(req,res) =>{
            const bearer = req.headers.authorization;
             
         if(bearer && bearer.startsWith('Bearer ')){
            const idToken = bearer.split(' ')[1];
            // console.log({ idToken })
            admin.auth().verifyIdToken(idToken)
            .then((decodedToken) => {
            const tokonEmail = decodedToken.email; 
            const queryEmail = req.query.email;
            console.log(tokonEmail,queryEmail)
             if(tokonEmail == req.query.email){
                booking.find({email: req.query.email})
                  .toArray((error,docs) =>{
                    res.status(200).send(docs);  
                  }) 
             }else{
                res.status(401).send('un-authorized access')
            }
         // ...
         })
         .catch((error) => {
            res.status(401).send('un-authorized access')
         });

         }else{
            res.status(401).send('un-authorized access')
        }   
    })
});

   
app.listen(port)