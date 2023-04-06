
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import 'dotenv/config'
import AWS from 'aws-sdk'

const PORT = process.env.PORT || 3000;

const app = express();
const jsonParser = bodyParser.json()

app.listen(PORT, () => {
  console.log("running on 3000");
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cors());
// app.use(router);

const SES_CONFIG = {
accessKeyId: process.env.AWS_ACCESS_KEY_ID,
secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
region: 'us-east-1',
};

const ses = new AWS.SES({region: 'us-east-1'});

app.post("/email", function(req, res){
  const output =`
  Contact Details
    Name: ${req.body.name}
    Email: ${req.body.email}
    Phone Number: ${req.body.tel}
    Looking for: ${req.body.service}
  Message:
    ${req.body.message}
  `;



  sesTest(output).then((val)=>{
    console.log("email sent", val, output);
  });
  res.redirect("/");
});

function sesTest(output){
    let params = {
      Destination: {
        CcAddresses: ["longcutlandscapingllc@gmail.com"],
      },
      Message: {
        Body: {
          Text: {
            Data: output
          }
        },
        Subject: {
          Data: "New Inquiry"
        }
      },
      Source: "longcutlandscapingllc@gmail.com"
    };
    return ses.sendEmail(params).promise();
  };
;

app.get("/nomore", function(req, res){
  res.render("nomore");
});

app.get('/robots.txt', function (req, res, next) {
  res.sendFile("../public/robots.txt", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    console.log(data);
    res.end(data) // Send Data
  });});

app.get('/sitemap.xml', function (req, res) {
  res.sendFile("./public/sitemap.xml", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return
    }
    console.log(data);
    res.end(data) // Send Data
  });
});


app.get("/", function(req, res){
  res.render("home");
});

app.get("/services", function(req, res){
  res.render("services");
});

app.get("/portfolio", function(req, res){
  res.render("portfolio");
});

app.get("/testimonials", function(req, res){
  res.render("testimonials");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/joinourteam", function(req, res){
  res.render("joinourteam");
});

export default app;
