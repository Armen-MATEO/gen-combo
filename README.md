## install packages 
```
npm install
```
## create a database in mysql
```
CREATE DATABASE yourDatabase_db;
```
```
USE yourDatabase_db;
```
## create tables
`items table`
```
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) UNIQUE
);
```
`responses table`

```
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON
);
```
`combinations table`
```
CREATE TABLE combinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id INT,
    combination JSON,
    FOREIGN KEY (response_id) REFERENCES responses(id)
);
```
` create .env file and add your password, user name and database name `
