const express = require('express');
const cors = require('cors');
const pool = require("./database.js");
const app = express();

app.use(express.json());
app.use(cors());

//localhost:3000
//localhost:4000
app.post('/adduser', (req, res) => {
    const id = req.body["id"];
    const username = req.body["username"];
    const password = req.body["password"];

    console.log("id"+id);
    console.log("username"+username);
    console.log("password"+password);

    const insertst =`INSERT INTO accounts (id, username, password) VALUES ( '${id}','${username}','${password}');`;
    pool.query(insertst).then((response) =>
    {
        console.log(response);
        res.send("User Added");
    }).catch((error) =>
    {
        console.log(error);
    });

    console.log(req.body);
    res.send("response Revieced"+req.body);
});
app.get('/getusers', (req, res) => {
    pool.query("SELECT * FROM accounts").then((response) =>
    {
        console.log(response.rows);
        res.send(response.rows);
    }).catch((error) =>
    {
        console.log(error);
    });
});
app.put('/updateuser', (req, res) => {
    const id = req.body["id"];
    const username = req.body["username"];
    const password = req.body["password"];

    console.log("id"+id);
    console.log("username"+username);
    console.log("password"+password);

    const updatest =`UPDATE accounts SET username = '${username}', password = '${password}' WHERE id = '${id}';`;
    pool.query(updatest).then((response) =>
    {
        console.log(response);
        res.send("User Updated");
    }).catch((error) =>
    {
        console.log(error);
    });

    console.log(req.body);
    res.send("response Revieced"+req.body);
}
);
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
