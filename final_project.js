var fs = require('fs');
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'test',
    database: 'final_p',
    dateStrings: 'date',
    multipleStatements: true
});

const express = require('express');
const app = express();
const url = require('url');
const { isArray } = require('util');
const { query } = require('express');

app.get("/login", (req, res) =>{
    loginpage(req, res);
});

app.get("/lab_home", (req, res) =>{
    labHome(req, res);
});

app.get("/test_collection", (req, res) =>{
    testCollection(req, res);
});

app.get("/poolMap", (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    poolMapping(req, res);
});

app.get("/wellTest", (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    wellTesting(req, res);
});

app.get("/reg", (req, res) =>{
    register(req, res);
});

app.get("/employee_login", (req, res) =>{
    emplogin(req, res);
});

app.get("/empHome", (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    employeeHome(req, res);
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

app.get("/del2", (req, res) =>{
    delData(req, res);
});

app.get("/del", (req, res) =>{
    deletes(req, res);
});

/*app.get("/del", (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    deletes(req, res);
});*/

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
            location.href= "/auth2?id="+labId+"&passwrd="+password;
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
                                        location.href= "/del2?delval="+chkBox.value;
                                        break;
                                    }

                                }
                            }
                        </script>`;
                    res.write(html + "\n\n</button></body>\n</html\>");
                    res.end();
                });
};

function poolMapping(req, res) {
    let query = url.parse(req.url, true).query;
    let PoolB = query.poolb ? query.poolb : "";
    let testB = query.testb ? query.testb : "";
    let upda = query.update ? query.update : "";
    if(PoolB != "" && testB != "") {
        if(upda == false) {
            pools(PoolB, testB);
        } else {
            upoolm(PoolB, testB);
        }
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pool Mapping</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        </head>
        <body onload='remove()'>
        </body>
        <script>
            function remove() {
                location.href='/poolMap';
            }
        </script>
        </html>
        `
        res.write(html);
        res.end();
        res.writeHead(200, {"Content-Type": "text/html"});
    }

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pool Mapping</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <style>
                #barcode_list {
                    margin-top: 15px;
                    border-collapse: collapse;
                }

                #barcode_list th {
                    border: 2px solid black;
                }

                #barcode_list td {
                    border: 2px solid black;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h4 style='margin-left: 200px'>Pool Mapping</h4>
            <form method='get' action='/poolMap'>
            <input type='hidden' id='isUp' name='update' value='false'/>
            <table>
                    <tr>
                        <th>Pool Barcode: </th>
                        <td>
                            <div>
                                <input type='text' id='p' name='poolb' value=""></input>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th style='vertical-align: top'>Test Barcode: </th>
                        <td>
                            <div>
                                <section style='border: 1px solid black; padding: 5px;'>
                                    <span>
                                    <span id='barcodes'></span>
                                        <button type='button' style='margin-left: 50px; margin-right:50px;' onclick='add_rows()'> Add more rows </button>
                                    </span>
                                </section>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>
                            <input type='submit' value='Submit Pool'></input>
                        </td>
                    </tr>
            </form>
        </table>

        <table id='barcode_list' style='width: 60%;'>
            <tr>
                <th>Pool Barcodes</th>
                <th>Test Barcodes</th>
            </tr>
        `;
   
    let sql = `SELECT * FROM Pool;`
    let testBa = "";
    let poolb = new Array();
    let testb = new Array();
    con.query(sql, function(err, result) {
        if(err) throw err;
        for(let item of result) {
            poolb.push(item.poolBarcode);
        }
        let sql3 = `SELECT poolBarcode, testBarcode FROM PoolMap ORDER BY poolBarcode ASC;`;
        con.query(sql3, function(err, result) {
            if(err) throw err;
            for(var j = 0; j < poolb.length; j++)
            {
                testb.splice(0,testb.length);
                for(var k = 0; k < result.length; k++) {
                    if(poolb[j] == result[k].poolBarcode) {
                        testb.push(result[k].testBarcode)
                    }
                }
                testBa = "";
                for(var i = 0; i < testb.length; i++) {
                        if(i != testb.length - 1)
                            testBa = testBa + testb[i] + ", ";
                        else
                            testBa += testb[i];
                }

                if(testb.length > 0)
                html += `
                    <tr>
                        <td><input type='checkbox' name='poolbar' value='` + poolb[j] + `'/>` + poolb[j] + `</td>
                        <td>` + testBa + `</td>
                    </tr>`;
            }
            res.write(html + `\n\n
                </table>
                <button type='button' onclick='edit()'>Edit Pool</button>
                <button type='button' onclick='del()'>Delete Pool</button>
                </body>
                <script>
                    $(document).on('click', '#kill', function(){
                        console.log('click');
                        $(this).parent('div.count').remove();
                    });

                    function add_rows() {
                        $('#barcodes').append("<div class='count'><input type='text' name='testb' value=''/> <button type='button' id='kill'>delete</button></div>");
                    }

                    function del() {
                        var table = document.getElementById('barcode_list');
                        var rowCnt = table.rows.length;
                        for(var i = 0; i < rowCnt; i++) {
                            var row = table.rows[i];
                            var chkBox = row.cells[0].childNodes[0];

                            if(chkBox != null && chkBox.checked == true) {
                                console.log(i);
                                location.href='/del?poolb=' + chkBox.value;
                                table.deleteRow(i);
                                rowCnt--;
                                i--;
                            }
                        }
                    }

                    function edit() {
                        $('#barcodes').html("");
                        var table = document.getElementById('barcode_list');
                        var rowCnt = table.rows.length;
                        for(var i = 0; i < rowCnt; i++) {
                            var row = table.rows[i];
                            var chkBox = row.cells[0].childNodes[0];

                            if(chkBox != null && chkBox.checked == true) {
                                $('#isUp').val('true');
                                $('#p').val(chkBox.value);
                                var tr = table.rows[i];
                                var td = tr.cells[1].childNodes[0].nodeValue;
                                var testb = td.split(',');
                                for(var k = 0; k < testb.length; k++)
                                    $('#barcodes').append("<div class='count'><input type='text' name='testb' value='" + testb[k].trim() + "'></input> <button type='button' id='kill'>delete</button></div>");  
                            }
                        }
                    }
                </script>
                </html>
                `);
            res.end();
        });
    });               
};

function wellTesting(req, res) {
    //    res.writeHead(200, {"Content-Type": "text/html"});
        let query = url.parse(req.url, true).query;
        let PoolB = query.Poolb ? query.Poolb : "";
        let WellB = query.Wellb ? query.Wellb : "";
        let Result = query.result ? query.result : "";
        let Time = query.times ? query.times : "";
        let upda = query.update ? query.update : "";
        if(PoolB != "" && WellB != "" && Result != "") {
            if(upda == "false") {
                wells(WellB, PoolB, Result, res);
            } else {
                uwellT(WellB, PoolB, Result, Time, res);
            }
            let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Well Testing</title>
            </head>
            <body onload='remove()'>
            </body>
            <script>
                function remove() {
                    location.href='/wellTest';
                }
            </script>
            </html>
            `
            res.write(html);
        }
    
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Well Testing</title>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <style>
                    #barcode_list {
                        margin-top: 15px;
                        border-collapse: collapse;
                        table-layout: fixed; word-break; break-all;
                    }
    
                    #barcode_list th {
                        border: 2px solid black;
                    }
    
                    #barcode_list td {
                        border: 2px solid black;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h4 style='margin-left: 200px'>Well testing</h4>
                <form method='get' action='/wellTest'>
                <input type='hidden' id='isUp' name='update' value='false'/>
                <input type='hidden' id='tt' name='times' value=''/>
                <table>
                        <tr>
                            <th>Well Barcode: </th>
                            <td>
                                <div>
                                    <input id='w' name='Wellb'></input>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>Pool Barcode: </th>
                            <td>
                                <div>
                                    <input id='p' name='Poolb'></input>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th style='text-align: left'>Result : </th>
                            <td>
                                <select id='r' name='result'>
                                    <option value='In progress'>In progress</option>
                                    <option value='Negative'>Negative</option>
                                    <option value='Positive'>Positive</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th></th>
                            <td>
                                <input type='submit' value='Add'></input>
                            </td>
                        </tr>
                </form>
            </table>
    
            <table id='barcode_list' style='width: 60%;'>
                <tr>
                    <th>Well Barcode</th>
                    <th>Pool Barcode</th>
                    <th>Result</th>
                </tr>`
            let sql3 = `SELECT wellBarcode, poolBarcode, testingStartTime, result FROM WellTesting ORDER BY wellBarcode ASC;`;
            con.query(sql3, function(err, resul) {
                if(err) throw err;
                for(var j = 0; j < resul.length; j++)
                {
                    html += `
                        <tr>
                            <td><input type='checkbox' name='wellbar' value='` + resul[j].wellBarcode + `'/>` + resul[j].wellBarcode + `</td>
                            <td>` + resul[j].poolBarcode + `</td>
                            <td>` + resul[j].result + `</td>
                            <td style='display:none'><input type='hidden' id='t' value='` + resul[j].testingStartTime +  `'/></td>
                        </tr>`;
                }
                res.write(html + `\n\n
                    </table>
                    <button type='button' onclick='edit()'>Edit</button>
                    <button type='button' onclick='del()'>Delete</button>
                    </body>
                    <script>
                        function del() {
                            var table = document.getElementById('barcode_list');
                            var rowCnt = table.rows.length;
                            for(var i = 0; i < rowCnt; i++) {
                                var row = table.rows[i];
                                var chkBox = row.cells[0].childNodes[0];
    
                                if(chkBox != null && chkBox.checked == true) {
                                    console.log(i);
                                    location.href='/del?wellb=' + chkBox.value;
                                    table.deleteRow(i);
                                    rowCnt--;
                                    i--;
                                }
                            }
                        }
            
                        function edit() {
                            var table = document.getElementById('barcode_list');
                            var rowCnt = table.rows.length;
                            for(var i = 0; i < rowCnt; i++) {
                                var row = table.rows[i];
                                var chkBox = row.cells[0].childNodes[0];
        
                                if(chkBox != null && chkBox.checked == true) {
                                    var tr = table.rows[i];
                                    $('#isUp').val('true');
                                    $('#w').val(chkBox.value);
                                    var pool = tr.cells[1].childNodes[0].nodeValue;
                                    $('#p').val(pool)
                                    var res = tr.cells[2].childNodes[0].nodeValue;
                                    $('#r').val(res);
                                    var timevalue = tr.cells[3].childNodes[0].value;
                                    $('#tt').val(timevalue);
                                }
                            }
                        }
                    </script>
                    </html>
                    `);
                    res.end();
            });
};
    
function register(req, res){
    let query =  url.parse(req.url, true).query;
    let empId = query.empId ? query.empId : "";
    let testb = query.testb ? query.testb : "";
    let addInfo = `INSERT INTO EmployeeTest(testBarcode, employeeID, collectionTime, colectedBy) VALUES ('` + testb + `','` + empId + `',NOW(),'`+ save + `');`;

    con.query(addInfo, function(err) {
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
};

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
};

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

            <button id='poolmap' name='poolmap' onclick="toPool()"> Pool Mapping </button>
            <br><br><br>
            <button id='welltest' name='welltest' onclick="toWell()"> Well testing </button>

            </body>
            <script>
                    function toPool(){
                        location.href='/poolMap';
                    }

                    function toWell() {
                        location.href='/wellTest';
                    }
            </script>
            </html>`;
        res.write(html);
        res.end();
};

function credAuth1(req, res){
    let query =  url.parse(req.url, true).query;
    let passwrd = query.passwrd ? query.passwrd : "";
    let labId = query.id ? query.id : "";
    let sql = `SELECT labID FROM LabEmployee WHERE password = '` + passwrd + `' AND labID = ` + labId + `;`;
    
    
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
                        alert("Wrong Password or LabID");
                        location.href='/login';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        };
    });
};

function credAuth2(req, res){
    let query =  url.parse(req.url, true).query;
    let passwrd = query.passwrd ? query.passwrd : "";
    let labId = query.id ? query.id : "";
    let sql = `SELECT labID FROM LabEmployee WHERE password = '` + passwrd + `' AND labID = ` + labId + `;`;

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
                        alert("Wrong Password or LabID");
                        location.href='/login';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        };
    });
};

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
                var email = document.getElementById('email').value;
                var password = document.getElementById('password').value;
                location.href= "/auth3?emailemp="+email+"&passwrd="+password;
            }
        </script>
        </body>
        </html>`
    res.write(html);
    res.end();
};

function employeeHome(req, res) {
    let query = url.parse(req.url, true).query;
    let empID = query.empID ? query.empID : "";
    let sql =  `SELECT WellTesting.testingEndTime, WellTesting.result from WellTesting LEFT JOIN EmployeeTest on WellTesting.poolBarcode IN (SELECT poolBarcode FROM PoolMap WHERE testBarcode IN (SELECT testBarcode from EmployeeTest where employeeID = '` + empID + `') GROUP BY poolBarcode) WHERE employeeID = '` + empID + `' GROUP BY result;`;
    let html = ``;
    con.query(sql, function(err, result) {
        if(err) { html = `
        <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body onload='goBack()'>
        <script>
            function goBack(){
                alert('Oops! Error Occurs!');
                location.href='/employee_login';
            }
        </script>
        </body>
        </html>`;
        res.write(html);
        res.end(); 
        } else {
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Home</title>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <style>
                #barcode_list {
                    margin-top: 15px;
                    border-collapse: collapse;
                    table-layout: fixed; word-break; break-all;
                }

                #barcode_list th {
                    border: 2px solid black;
                }

                #barcode_list td {
                    border: 2px solid black;
                    text-align: center;
                }
            </style>
        </head>
        <body>
        <h4 style='margin-left: 200px'>Employee Home</h4>
        <table id='barcode_list' style='width: 60%;'>
            <tr>
                <th>Collection Date</th>
                <th>Result</th>
            </tr>`
                for(let re of result) {
                    html += `<tr>
                                <td>` + re.testingEndTime + `</td>
                                <td>` + re.result + `</td>
                            </tr>`
                }
        `</table>
        </body>
        </html>
    `;
    res.write(html);
    res.end();
    }
    });
};

function credAuth3(req, res){
    let query =  url.parse(req.url, true).query;
    let passwrd = query.passwrd ? query.passwrd : "";
    let emailemp = query.emailemp ? query.emailemp : "";
    let sql = `SELECT employeeID FROM Employee WHERE passcode = '` + passwrd + `' AND email = '` + emailemp + `';`;

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
                        location.href='/empHome?empID=` + result[0].employeeID + `';
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
                        alert("Wrong Password or Email");
                        location.href='/employee_login';
                    }
                </script>
                </html>`
            res.write(html);
            res.end();
        };
    });
};

function pools(pb, tb) {
    let sql = `SELECT * FROM Pool WHERE poolBarcode = '` + pb + `';`;
    con.query(sql, function(err, result){
        if(err) throw err;
        if(result.length < 1){
            let sql2 = `INSERT INTO Pool VALUES('` + pb + `');`;
            con.query(sql2, function(err) {
                if(err) throw err;
            });
            poolm(pb, tb);
        }
    });
};

function poolm(pb, tb) {
    if(isArray(tb)) {
        for(var i = 0; i < tb.length; i++) {
            let sql = `INSERT INTO PoolMap VALUES('` + tb[i] + `', '` + pb + `');`;
            con.query(sql, function(err) {
                if(err) throw err;
            });
        }
    }
    else {
        let sql = `INSERT INTO PoolMap VALUES('` + tb + `', '` + pb + `');`;
        con.query(sql, function(err) {
            if(err) throw err;
        });
    }
};

function upoolm(pb, tb) {
    let sqls = `DELETE FROM PoolMap WHERE poolBarcode='` + pb + `';`;
    con.query(sqls, function(err) {
        if(err) throw err;
        if(isArray(tb)) {
            for(var i = 0; i < tb.length; i++) {
                let sql = `INSERT INTO PoolMap VALUES('` + tb[i] + `', '` + pb + `');`;
                con.query(sql, function(err) {
                    if(err) throw err;
                });
            }
        }
        else {
            let sql = `INSERT INTO PoolMap VALUES('` + tb + `', '` + pb + `');`;
            console.log(sql);
            con.query(sql, function(err) {
                if(err) throw err;
            });
        }
    });
};

function wells(wb, pb, r, res) {
    let sql = `SELECT * FROM Well WHERE wellBarcode = '` + wb + `';`;
    con.query(sql, function(err, result) {
        if(err) throw err;
        if(result.length < 1) {
            let sql2 = `INSERT INTO Well VALUES('` + wb + `');`;
            con.query(sql2, function(err) {
                if(err) throw err;
            });
            wellT(wb, pb, r);
        }
    });
                       
};

function wellT(wb, pb, resu) {
    let sql = `INSERT INTO WellTesting(poolBarcode, wellBarcode, testingStartTime, testingEndTime, result) VALUES('` + pb + `', '` + wb + `', NOW(), NOW(), '` + resu + `');`;
    con.query(sql, function(err) {
        if(err) throw err;
    });
};

function uwellT(wb, pb, resu, times) {
    let sqls = `UPDATE WellTesting SET poolBarcode='` + pb + `', wellBarcode='` + wb + `', testingEndTime=NOW(), result='` + resu +  `' WHERE testingStartTime='` + times + `';`;
    con.query(sqls, function(err) {
        if(err) throw err;
    });
};

function deletes(req, res) {
    let query = url.parse(req.url, true).query;
    let poolb = query.poolb ? query.poolb : "";
    let wellb = query.wellb ? query.wellb : "";
    
    if(wellb == "" && poolb != "") {
        let sql = `DELETE FROM PoolMap WHERE poolBarcode = '` + poolb + `';`;
        let sql2 = `DELETE FROM Pool WHERE poolBarcode ='` + wellb + `';`;
        con.query(sql + sql2, function(err) {
            if(err) throw err;
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                </head>
                <body onload='toPool()'>
                </body>
                <script>
                    function toPool() {
                        location.href = '/poolMap';
                    }
                </script>
                </html>`;
            res.write(html);
            res.end();
        });
    } else if(wellb != "" && poolb == "") {
        let sql = `DELETE FROM WellTesting WHERE wellBarcode ='` + wellb + `';`;
        let sql2 = `DELETE FROM Well WHERE wellBarcode ='` + wellb + `';`;
        con.query(sql + sql2, function(err) {
            if(err) throw err;
            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                </head>
                <body onload='toWell()'>
                </body>
                <script>
                    function toWell() {
                        location.href = '/wellTest';
                    }
                </script>
                </html>`;
            res.write(html);
            res.end();
        });
    }
};