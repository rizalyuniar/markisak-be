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

// Funciton to select all liked by id
function selectAllLikes(queryId) {
    return pool.query(
        `SELECT recipes.* FROM liked_recipes INNER JOIN recipes ON liked_recipes.id_recipe = recipes.id WHERE liked_recipes.id_user = '${queryId}'`
    );
}

// Funciton to select all saved by id
function selectAllSaved(queryId) {
    return pool.query(
        `SELECT recipes.* FROM saved_recipes INNER JOIN recipes ON saved_recipes.id_recipe = recipes.id WHERE saved_recipes.id_user = '${queryId}'`
    );
}

// Function to select from email
function selectUserEmail(email) {
    return pool.query(`SELECT * FROM users WHERE email='${email}'`);
}

// Function to select recipes using id_user
function selectUserRecipes(queryId) {
    return pool.query(`SELECT * FROM recipes WHERE id_user='${queryId}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id from users where id='${id}'`, 
        (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

module.exports = {
    selectAllUser,
    countUser,
    selectUser,
    insertUser,
    deleteUser,
    updateUser,
    selectAllLikes,
    selectAllSaved,
    selectUserEmail,
    selectUserRecipes,
    findId
};
