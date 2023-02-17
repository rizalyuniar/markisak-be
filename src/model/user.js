// Import database config from config folder
const pool = require("../config/db");

// Function to query all or search table
function selectAllUser(
    querySearch,
    querySortBy,
    querySort,
    queryLimit,
    queryOffset
) {
    return pool.query(
        `SELECT * FROM users WHERE name ILIKE '%${querySearch}%' ` +
            `ORDER BY ${querySortBy} ${querySort} LIMIT ${queryLimit} OFFSET ${queryOffset}`
    );
}

// Function to count
function countUser() {
    return pool.query(`SELECT COUNT(*) FROM users`);
}

// Function to get record from id
function selectUser(queryId) {
    return pool.query(`SELECT * FROM users WHERE id='${queryId}'`);
}

// Function to insert
function insertUser(queryObject) {
    const { queryPwd, queryId, name, email, phone_number, queryFilename } =
        queryObject;
    return pool.query(
        `INSERT INTO users(id, name, email, phone_number, password, photo) ` +
            `VALUES('${queryId}', '${name}', '${email}', ${phone_number}, '${queryPwd}', '${queryFilename}')`
    );
}

// Function to update record
function updateUser(queryObject) {
    const { id, name, email, phone_number, queryPwd, queryFilename } =
        queryObject;
    return pool.query(
        `UPDATE users SET name='${name}', ` +
            `email='${email}', phone_number='${phone_number}', password='${queryPwd}', photo='${queryFilename}' WHERE id='${id}'`
    );
}

// Function to delete record from id
function deleteUser(queryId) {
    return pool.query(`DELETE FROM users WHERE id='${queryId}'`);
}

module.exports = {
    selectAllUser,
    countUser,
    selectUser,
    insertUser,
    deleteUser,
    updateUser,
};
