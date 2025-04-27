const sqlite3 = require('sqlite3').verbose();
let sql;

//conecting to DB
const db = new sqlite3.Database('./test.db',sqlite3.OPEN_READWRITE,(err)=>{
    if (err)
         return console.error(err.message);
})
//creating a table
//sql = 'CREATE TABLE users(id INTEGER PRIMARY KEY, first_name,username,password)';
//db.run(sql);

//dropping a table
//db.run("DROP TABLE users")

//insert data into table
//sql = 'INSERT INTO users(first_name,username,password) VALUES (?,?,?)';
//db.run(sql,["greg","greg2468","gregiscool123"],(err)=> {
//    if (err) return console.error(err.message);
//})

//update data
//sql = 'UPDATE users SET first_name = ? WHERE id = ?';
//db.run(sql,['Jake',1],(err)=>{
//    if (err) return console.error(err.message);
//})

//delet data
/*sql = 'DELETE FROM users WHERE id = ?';
db.run(sql,[2],(err)=>{
    if (err) return console.error(err.message);
})

//query the data
sql = 'SELECT * FROM users';
db.all(sql,[],(err,rows)=>{
    if (err) return console.error(err.message);
    rows.forEach((row)=>{
        console.log(row);
    })
})*/