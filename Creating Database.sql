Create Database Final_P;

USE Final_P;

Create Table Employee(employeeID varchar(20) primary key, email varchar(50), firstName varchar(50), lastName varchar(50), passcode varchar(50));

Create Table EmployeeTest(testBarcode varchar(50) primary key, employeeID varchar(20) not null, collectionTime datetime not null, colectedBy varchar(50));

Create Table LabEmployee(labID varchar(50) primary key, password varchar(50));

Create Table Pool(poolBarcode varchar(50) primary key);

Create Table PoolMap(testBarcode varchar(50), poolBarcode varchar(50));

Create Table Well(wellBarcode varchar(50) primary key);

Create Table WellTesting(poolBarcode varchar(50), wellBarcode varchar(50), testingStartTime datetime, testingEndTime datetime, result varchar(20));

Alter table EmployeeTest add foreign key(collectedBy) references LabEmployee(labID);

Alter table EmployeeTest add foreign key(employeeID) references Employee(employeeID);

Alter Table PoolMap add foreign key(testBarcode) references EmployeeTest(testBarcode);

Alter Table PoolMap add foreign key(poolBarcode) references Pool(PoolBarcode);

Alter Table WellTesting add foreign key(poolBarcode) references Pool(poolBarcode);

Alter Table WellTesting add foreign key(wellBarcode) references Well(wellBarcode);