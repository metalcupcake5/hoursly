const express = require('express');
const sql = require('./sql');

const app = express();
const port = 32464;

app.set('view engine', 'ejs')
app.use(express.static('public'));

app.all('/', async (req, res) => {
    let fields = ['name', 'description', 'lat', 'long', 'hours', 'date', 'time'];
    let data = {}
    for (const field of fields) {
        if (req.query[field]) {
            data[field] = req.query[field];
        }
    }
    const dataLength = Object.entries(data).length
    const submission = dataLength > 0 ? true : false;
    const valid = dataLength == 7 ? true : false;
    if (submission && valid) {
        await sql.query('SELECT * FROM locationsdata WHERE Latitude = ? AND Longitude = ?', [data.lat, data.long], (err, result) => {
            if (err) {
                console.log(err);
                return res.render('index', { submission: true, message: "An error occured, please try again." });
            }

            if (result.length !== 0) {
                return res.render('index', { submission: true, message: "This spot is already taken! Please choose another!" });
            } else {
                const input = {
                    Name: data.name,
                    Hours: data.hours,
                    Time: data.time,
                    Description: data.description,
                    Longitude: data.long,
                    Latitude: data.lat
                }
                sql.query('INSERT INTO locationsdata SET ?', input, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.render('index', { submission: true, message: "An error occured, please try again." });
                    }
                    return res.render('submit');
                });
            }
        });
    } else {
        let message = null;
        if (dataLength < 7) {
            message = "You are missing some fields!";
        }
        res.render('index', { submission: submission, message: message });
    }
});

app.all('/submit', async (req, res) => {
    if (req.query.name) {
        res.render('submit')
    }
    res.render('submit', { sql });
});

/*app.all('/addEvent', async (req, res) => {
    const name = req.query.name;
    const desc = req.query.desc;
    console.log(name);
    console.log(desc);
    res.render('submit')
});*/

app.listen(port, () => console.log(`site running on http://localhost:${port}`));