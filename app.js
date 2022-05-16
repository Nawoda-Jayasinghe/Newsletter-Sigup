const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');

const app = express();

//need this function before accessing local files like css and images
app.use(express.static("public"));
//now we give the paths relative to this location and we tore all static fies here

app.use(bodyParser.urlencoded({extended:true})); //we tell the app to use body parser

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req,res){
    console.log("Received form data post request");

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //we have to create a new js object with our key value pairs
    const data = {
        members:[
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = 'https://us8.api.mailchimp.com/3.0/lists/6e8c094cfb'; //got from mailchimp website

    const options = {
        method: "POST",
        auth: "VonArtZ:1754aa7e000ae3c519a1df45d6603ac1-us8"
        //we need some sort of an authenticattion
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    
    if (response.statusCode === 200){
       // res.send("Successfully Subscribed");
       res.sendFile(__dirname+"/success.html");
    }
    else{
       // res.send("Try again");
       res.sendFile(__dirname+"/failure.html");
    }

    request.write(jsonData);
    request.end();

    console.log( firstName + lastName + email)
})

app.post("/failure", function(req,res){
    res.redirect("/"); //redirect to home from failure page after clicking try again
})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})
//API KEY
//1754aa7e000ae3c519a1df45d6603ac1-us8

//LIST ID
//6e8c094cfb