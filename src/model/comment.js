const pool = require('../config/db');

const selectRecipeComments = (id_recipe) => {
    return pool.query(`select comments.id, users.name as name, users.photo as photo, comments.message, 
        comments.created_at from comments inner join users on comments.id_user = users.id 
        where id_recipe='${id_recipe}'`)
}

const selectComment = (id) => {
    return pool.query(`select comments.id, users.name as name, users.photo as photo, comments.message, 
        comments.created_at from comments inner join users on comments.id_user = users.id 
        where id='${id}'`)
}

const insertComment = (data) => {
    const { id, id_user, id_recipe, message, created_at, updated_at } = data;
    return pool.query(`insert into comments values('${id}', '${id_user}', 
        '${id_recipe}', '${message}', '${created_at}', '${updated_at}')`);
}

const updateComment = (data) => {
    const { id, message, updated_at } = data;
    return pool.query(`update comments set message='${message}',
        updated_at=${updated_at} where id='${id}'`);
}

const deleteComment = (id) => {
    return pool.query(`delete from comments where id='${id}'`);
}

const countRecipeComment = (id_recipe) => {
    return pool.query(`select count(*) from comments where id_recipe='${id_recipe}'`);
}

const findId = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`select id from comments where id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    )
}

module.exports = {
    selectRecipeComments,
    selectComment,
    insertComment,
    updateComment,
    deleteComment,
    countRecipeComment,
    findId
}