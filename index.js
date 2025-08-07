import express from "express";
import bodyParser from "body-parser"; //not sure this is necessary.
import fs from "fs";

const app = express();
const port = 3001;
const ideaFile = "./public/ideas.txt"


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : false }))

app.listen(port, ()=>{
    console.log(`scoring server running on port ${port}`);
});

function writeMessage(message) {
    fs.appendFile (ideaFile, message + "\n", (err) => { 
        if (err) { throw (err) }
    });
}


function readMessage(handlerFn) {
    fs.readFile(ideaFile, 'utf8', (err, data) => { 
        if (err) {
            throw (err);
        } else {
            handlerFn(data);
        }
    });
    return;
}

app.get("/", (req, res) => { 
    res.render("whatsup.ejs");
});

app.post("/whatsup", (req, res) => {
    writeMessage(req.body.newIdea);
    res.redirect("/");
});

app.post("/summary", (req, res) => { 
    if (req.body.reqType == "displayMessage") {
        readMessage((fullFile) => {
            res.render("summary.ejs", { fullFile: fullFile });
        });
    } else {
        res.download("./public/ideas.txt", "ideas.txt", (err) => {
            if (err) {
                throw (err);
            } else {
                console.log("The file was sent to the client for download.")
            }
        });
    }
});