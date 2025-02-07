## install packages 
```
npm install
```
## create a database in mysql
```
create database yourDatabase_db;
```
```
 use yourDatabase_db;
```
## create tables
`items table`
```
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL
);
```
`responses table`

```
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data JSON NOT NULL
);
```
`combinations table`
```
CREATE TABLE combinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    response_id INT NOT NULL,
    combination JSON NOT NULL,
    FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE
);
```
` create .env file and add your password, user name and database name `
