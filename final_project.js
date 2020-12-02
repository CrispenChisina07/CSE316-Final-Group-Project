var fs = require('fs');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'CScourses',
    password: 'stonybrook',
    database: 'final_p'
});

const express = require('express');
const app = express();
const url = require('url');

app.get("/login", (req, res) =>{
    loginpage(req, res);
});

app.get("/lab_home", (req, res) =>{
    labHome(req, res);
});

app.get("/test_collection", (req, res) =>{
    testCollection(req, res);
});

app.get("/reg", (req, res) =>{
    register(req, res);
});

app.get("/employee_login", (req, res) =>{
    emplogin(req, res);
});

app.get("/auth1", (req, res) =>{
    credAuth1(req, res);
});

app.get("/auth2", (req, res) =>{
    credAuth2(req, res);
});

app.get("/auth3", (req, res) =>{
    credAuth3(req, res);
});

app.get("/del", (req, res) =>{
    delData(req, res);
});

port = process.env.PORT || 3000;
 app.listen(port, () => {
     console.log('Server Started!');
 });

 var save;

function loginpage(req, res){
        res.writeHead(200, { "Content-Type": "text/html"});
        let query = url.parse(req.url, true).query;

        let html = `
        <!DOCTYPE html>
        <html>
        <body>
        <head>
        </head>
        <h2> Login Page</h2>

        <form method="get" action ="/login">
            LabID:<input type="text" id ="labID" name="labID" value="">
            <br><br>
            Password: <input type="text" id ="password" name="password" value="">
            <br><br>
            <input type="button" id ="logC" onclick="authenticate()" value="Login Collector">
            <input type="button" id ="labLog" onclick="authenticate2()"  value="Lab login">
        </form>
        <script>
            function authenticate(){
                var labId = document.getElementById('labID').value;
                var password = document.getElementById('password').value;
                var logCol = document.getElementById('logC').value;
                location.href= "/auth1?id="+labId+"&passwrd="+password;
            }
            function authenticate2(){
                var labId = document.getElementById('labID').value;
                var password = document.getElementById('password').value;
                var labLog = document.getElementById('labLog').value
                location.href= "/auth2?passwrd="+password;
            }
        </script>
        </body>
        </html>`
    res.write(html);
    res.end();
}

function testCollection(req, res){
    res.writeHead(200, { "Content-Type": "text/html"});
    let query = url.parse(req.url, true).query;

    let html = `
    <!DOCTYPE html>
        <html>
        <head>
            <style>
                    table{
                        table-layout: fixed;
                        border-left: 2px solid gray;
                        border-right: 2px solid gray;
                        border-top: 2px solid gray;
                        border-bottom: 2px solid gray;
                        border-collapse: collapse;
                        height: 50%;
                        width: 50%;
                    }
                    th {
                        text-align: center;
                        border-left: 2px solid gray;
                        border-bottom: 4px solid gray;
                    }
                    td{
                        vertical-align: top;
                        background-color: white;
                        border-left: 2px solid gray;
                        border-bottom: 2px solid gray;
                    }
            </style>
        </head>
        <body>
        <h2> Test Collection</h2>

        <form method="get" action ="/test_collection">
            Employee ID:<input type="text" id ="emplId" name="emplId" value="">
            <br><br>
            Test Barcode: <input type="text" id ="barcode" name="barcode" value="">
            <br><br>
            <input type="button" onclick="addData()" value="Add">
        </form>
        <script>
            function addData(){
                var id = document.getElementById('emplId').value;
                var barcode = document.getElementById('barcode').value;
                location.href= "/reg?empId="+id+"&testb="+barcode;
            }
        </script>
        <br>
        <table id='testColl_list'>
            <tr>
                <th>Employee ID</th>
                <th>Test Barcode</th>
            </tr>
        `;
                let employData = `SELECT employeeID, testBarcode FROM EmployeeTest;`;
                con.query(employData, function(err, result){
                    if(err) throw err;
                    var idlist = [];
                    var barlist = [];
                    for (let item of result) {
                        idlist.push(item.employeeID);
                        barlist.push(item.testBarcode);
                    };  
                        for(var i = 0; i < idlist.length; i++){
                            html += `<tr>`;
                            if(idlist[i] != null && idlist.length > i){
                                html += `<td><input type="checkbox" name="rowData" value="` + idlist[i] + `"/><b>` + idlist[i] + `</td>`;
                                html += `<td><b>` + barlist[i] + `</td>`;
                            }
                            else
                                html += ``;
                            html += `</tr>`;
                        };    
                    html += `</table><button id='delbtn' name='delete' onclick="delData()"> Delete
                        <script>
                            function delData(){
                                var table = document.getElementById('testColl_list');
                                var rowCnt = table.rows.length;
                                for(var i = 0; i < rowCnt; i++) {
                                    var row = table.rows[i];
                                    var chkBox = row.cells[0].childNodes[0];
                                    if(chkBox != null && chkBox.checked == true) {
                                        location.href= "/del?delval="+chkBox.value;
                                        break;
                                    }

                                }
                            }
                        </script>`;
                    res.write(html + "\n\n</button></body>\n</html\>");
                    res.end();
                });
}

function register(req, res){
    let query =  url.parse(req.url, true).query;
    let empId = query.empId ? query.empId : "";
    let testb = query.testb ? query.testb : "";
    let addInfo = `INSERT INTO EmployeeTest(testBarcode, employeeID, collectionTime, collectedBy) VALUES (` + testb + `,` + empId + `,NOW(),`+ save + `);`;


    con.query(addInfo, function(err, result) {
        if(err) throw err;
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body onload='toTestPage()'>
            </body>
            <script>
                function toTestPage() {
                    location.href = '/test_collection';
                }
            </script>
            </html>`;
        res.write(html);
        res.end();
    }); 
}

function delData(req, res){
    let query =  url.parse(req.url, true).query;
    let delval = query.delval ? query.delval : "";
    let sql = `DELETE FROM EmployeeTest WHERE employeeID = '` + delval + `';`;
    con.query(sql, function(err) {
        if(err) throw err;
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body onload='toDelete()'>
            </body>
            <script>
                function toDelete() {
                    location.href = '/test_collection';
                }
            </script>
            </html>`;
        res.write(html);
        res.end();
    });
}

function labHome(req, res){
    res.writeHead(200, { "Content-Type": "text/html"});
    let query = url.parse(req.url, true).query;

    let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    button {
                        align: center;
                        font-weight: bold;
                        font-size: 16pt;
                        padding: 14px 28px;
                        text-align: center;
                        cursor: pointer;
                        width: 60%;
                        background-color: cornflowerblue;
                    }
                </style>
            </head>
            <body>

            <h2> Lab Home</h2>

            <button id='poolmap' name='poolmap' onclick=""> Pool Mapping </button>
            <br><br><br>
            <button id='welltest' name='welltest' onclick=""> Well testing </button>

            </body>
            </html>`;
        res.write(html);
        res.end();
}


function credAuth1(req, res){
    let query =  url.parse(req.url, true).query;
    let passwrd = query.passwrd ? query.passwrd : "";
    let labId = query.id ? query.id : "";
    let sql = `SELECT labID FROM LabEmployee WHERE password = '` + passwrd + `';`;
    
    
    con.query(sql, function(err, result) {
        if(err) throw err;
        if(result.length > 0) {
            save = labId;
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload="test()">
                </body>
                <script>
                    function test() {
                        location.href='/test_collection';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        }else {
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload="Alerts()">
                </body>
                <script>
                    function Alerts() {
                        alert("Wrong Password");
                        location.href='/login';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        };
    });
}

function credAuth2(req, res){
    let query =  url.parse(req.url, true).query;
    let passwrd = query.passwrd ? query.passwrd : "";
    let sql = `SELECT labID FROM LabEmployee WHERE password = '` + passwrd + `';`;

    con.query(sql, function(err, result) {
        if(err) throw err;
        if(result.length > 0) {
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload="test()">
                </body>
                <script>
                    function test() {
                        location.href='/lab_home';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        }else {
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload="Alerts()">
                </body>
                <script>
                    function Alerts() {
                        alert("Wrong Password");
                        location.href='/login';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        };
    });
}

function emplogin(req, res){
    res.writeHead(200, { "Content-Type": "text/html"});
        let query = url.parse(req.url, true).query;

        let html = `
        <!DOCTYPE html>
        <html>
        <body>
        <head>
        </head>
        <h2> Employee Login Page for Results</h2>

        <form method="get" action ="/employee_login">
            Email:<input type="text" id ="email" name="email" value="">
            <br><br>
            Password: <input type="text" id ="password" name="password" value="">
            <br><br>
            <input type="button" id ="login" onclick="authenticate3()" value="Login">
        </form>
        <script>
            function authenticate3(){
                var password = document.getElementById('password').value;
                location.href= "/auth3?passwrd="+password;
            }
        </script>
        </body>
        </html>`
    res.write(html);
    res.end();
}

function credAuth3(req, res){
    let query =  url.parse(req.url, true).query;
    let passwrd = query.passwrd ? query.passwrd : "";
    let sql = `SELECT employeeID FROM Employee WHERE passcode = '` + passwrd + `';`;

    con.query(sql, function(err, result) {
        if(err) throw err;
        if(result.length > 0) {
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload="login()">
                </body>
                <script>
                    function login() {
                        location.href='/lab_home';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        }else {
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload="Alerts()">
                </body>
                <script>
                    function Alerts() {
                        alert("Wrong Password");
                        location.href='/employee_login';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        };
    });
}