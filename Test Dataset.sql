USE Final_P;

delete from pool where poolBarcode='003';

SELECT * FROM Pool;
SELECT * FROM PoolMap;
SELECT * FROM EmployeeTest;
SELECT * FROM WellTesting;
SELECT WellTesting.testingEndTime, WellTesting.result, PoolMap.testBarcode from WellTesting LEFT JOIN EmployeeTest on WellTesting.poolBarcode IN (SELECT poolBarcode FROM PoolMap WHERE testBarcode IN (SELECT testBarcode from EmployeeTest where employeeID = '111')) LEFT JOIN PoolMap ON PoolMap.poolBarcode IN (SELECT poolBarcode FROM PoolMap WHERE testBarcode IN (SELECT testBarcode from EmployeeTest where employeeID = '111')) WHERE employeeID = '111';

INSERT INTO Employee values('111', 'aaa@gmail.com', 'a', 'aa', 'abc');
INSERT INTO Employee values('222', 'bbb@gmail.com', 'b', 'bb', 'bcd');
INSERT INTO Employee values('333', 'ccc@gmail.com', 'c', 'cc', 'cde');
INSERT INTO Employee values('444', 'ddd@gmail.com', 'd', 'dd', 'def');
INSERT INTO Employee values('555', 'eee@gmail.com', 'e', 'ee', 'efg');
INSERT INTO Employee values('666', 'fff@gmail.com', 'f', 'ff', 'fgh');
INSERT INTO Employee values('777', 'ggg@gmail.com', 'g', 'gg', 'ghi');
INSERT INTO Employee values('888', 'hhh@gmail.com', 'h', 'hh', 'hij');
INSERT INTO Employee values('999', 'iii@gmail.com', 'i', 'ii', 'ijk');
INSERT INTO Employee values('000', 'jjj@gmail.com', 'j', 'jj', 'jkl');
INSERT INTO Employee values('123', 'kkk@gmail.com', 'k', 'kk', 'klm');
INSERT INTO Employee values('234', 'lll@gmail.com', 'l', 'll', 'lmn');
INSERT INTO Employee values('345', 'mmm@gmail.com', 'm', 'mm', 'mno');

INSERT INTO LabEmployee values('011', '000');
INSERT INTO LabEmployee values('012', '111');