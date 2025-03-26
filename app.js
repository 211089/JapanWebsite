const http = require ('http')
const fs = require('fs')
const app = express();
const port = 5000

const server = http.createServer(function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('index.html', function(error, data) {
        if(error) {
            res.writeHead(404)
            res.write('Error: file not found')
        }
        else {
            res.write(data)
        }
    })  
    res.write('Hello Node')
    res.end()
})

server.listen(port, function(error){
    if(error){
        console.log('Something went wrong', error)
    }
    else{
        console.log('Server is listening on port ' + port)
    }
})

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, "data", "flashcards.json");

const loadFlashcards = () => {
    try {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveFlashcards = (flashcards) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(flashcards, null, 2));
};

app.get("/", (req, res) => {
    const flashcards = loadFlashcards();
    res.render("index", { flashcards });
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/add", (req, res) => {
    const { question, answer } = req.body;
    let flashcards = loadFlashcards();
    flashcards.push({ question, answer });
    saveFlashcards(flashcards);
    res.redirect("/");
});
