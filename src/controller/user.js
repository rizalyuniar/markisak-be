// Import models
const userModel = require("../model/user");

// Import jwt
const jwt = require("jsonwebtoken");

// Import hash
const bcrypt = require("bcryptjs");

// Import random id
const { v4: uuidv4 } = require("uuid");

// Import Helper for Template Response
const commonHelper = require("../helper/common");

// Import Helper for authentication
const authHelper = require("../helper/auth");

// Function to get all or search from databas
const getAllUsers = async (req, res) => {
    // Taking query params as const
    const queryPage = Number(req.query.page) || 1;
    const querySearch = req.query.search || "";
    const querySortBy = req.query.sortby || "name";
    const querySort = req.query.sort || "ASC";
    const queryLimit = Number(req.query.limit) || 5;
    const queryOffset = (queryPage - 1) * queryLimit;

    // Error handling for query database
    try {
        // Calling selectAll method from model
        const result = await userModel.selectAllUser(
            querySearch,
            querySortBy,
            querySort,
            queryLimit,
            queryOffset
        );

        // Calling count method from model
        const {
            rows: [count],
        } = await userModel.countUser();

        // Display response
        const totalData = parseInt(count.count);
        const totalPage = Math.ceil(totalData / queryLimit);
        const pagination = {
            currentPage: queryPage,
            limit: queryLimit,
            totalData,
            totalPage,
        };
        // Conditional if database return no item
        if (result.rowCount > 0) {
            commonHelper.response(
                res,
                result.rows,
                200,
                "Get all user successful",
                pagination
            );
        } else {
            commonHelper.response(res, null, 404, "No data user found");
        }
    } catch (err) {
        console.log(err);
        commonHelper.response(res, null, 500, "Failed to get data users");
    }
};

// Function to get detail based on id
const getDetailUser = async (req, res) => {
    // Taking params as const
    const queryId = req.params.id;
    // Error handling for query database
    try {
        // Calling select from model and then display
        const result = await userModel.selectUser(queryId);

        //Check if user exists
        const { rowCount } = await userModel.findId(queryId);
        if (!rowCount) return commonHelper.response(res, null, 404, "User not found");

        console.log(queryId)
        const likes = await userModel.selectAllLikes(queryId);
        const saved = await userModel.selectAllSaved(queryId);
        const recipes = await userModel.selectUserRecipes(queryId);

        result.rows[0].likes = likes.rows;
        result.rows[0].saved = saved.rows;
        result.rows[0].recipes = recipes.rows;

        console.log(result)
        //Delete user password
        delete result.rows[0].password;

        // Conditional if database return no item
        if (result.rowCount > 0) {
            commonHelper.response(
                res,
                result.rows,
                200,
                "Get detail user successful"
            );
        } else {
            commonHelper.response(res, null, 404, "No data user found");
        }
    } catch (err) {
        console.log(err);
        commonHelper.response(res, null, 500, "Failed to get data user");
    }
};

// Function to create
const registerUser = (req, res) => {
    // Creating random id
    req.body.queryId = uuidv4();
    // Adding photo filename to req body
    const HOST = process.env.HOST;
    const PORT = process.env.PORT;
    // Default photo if there is no photo
    try {
        req.body.queryFilename = `http://${HOST}:${PORT}/${req.file.filename}`;
    } catch (err) {
        req.body.queryFilename = "photo.jpg";
    }
    // Creating hash password
    const salt = bcrypt.genSaltSync(10);
    req.body.queryPwd = bcrypt.hashSync(req.body.password, salt);
    // Calling insert from model
    userModel
        .insertUser(req.body)
        .then((result) => {
            // Display the result
            commonHelper.response(res, result.rows, 201, "User created");
        })
        .catch((err) => {
            console.log(err);
            commonHelper.response(res, null, 400, "Input invalid");
        });
};

//   Function to update
const updateUser = async (req, res) => {
    // Set param id as const
    const paramId = req.params.id;
    // Adding id
    req.body.id = paramId;
    const HOST = process.env.HOST;
    const PORT = process.env.PORT;
    // Set default if no photo data passed
    try {
        // Calling select method from model
        const result = await userModel.selectUser(paramId);
        if (result.rowCount > 0) {
            if (typeof req.body.name == "undefined" || req.body.name == "") {
                req.body.name = result.rows[0].name;
            }
            if (typeof req.body.email == "undefined" || req.body.email == "") {
                req.body.email = result.rows[0].email;
            }
            if (
                typeof req.body.phone_number == "undefined" ||
                req.body.phone_number == ""
            ) {
                req.body.phone_number = result.rows[0].phone_number;
            }
            if (
                typeof req.body.password == "undefined" ||
                req.body.password == ""
            ) {
                req.body.queryPwd = result.rows[0].password;
            } else {
                // Creating hash password
                const salt = bcrypt.genSaltSync(10);
                req.body.queryPwd = bcrypt.hashSync(req.body.password, salt);
            }
            try {
                req.body.queryFilename = `http://${HOST}:${PORT}/${req.file.filename}`;
                // Add photo removal function here
            } catch (err) {
                req.body.queryFilename = result.rows[0].photo;
            }
            userModel.updateUser(req.body).then((rslt) => {
                commonHelper.response(res, rslt.rows, 200, "User Updated");
            });
        } else {
            commonHelper.response(res, null, 404, "No matching id");
        }
    } catch (err) {
        console.log(err);
        commonHelper.response(res, null, 500, "Failed to update user");
    }
};

// Function to delete
const deleteUser = async (req, res) => {
    const paramId = req.params.id;
    //   userModel
    //     .selectUser(paramId)
    //     .then((result) => {
    //       To delete picture
    //         const filename = result.rows.product_filename;
    //         if (typeof filename !== "undefined") {
    //           fs.unlinkSync(__dirname + "/../uploads/" + filename);
    //         }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       res.send(err.detail);
    //     });
    userModel
        .deleteUser(paramId)
        .then((result) => {
            // Display the result
            if (result.rowCount > 0) {
                commonHelper.response(
                    res,
                    result.rows,
                    200,
                    "User deletion success"
                );
            } else {
                commonHelper.response(res, null, 404, "Id not found");
            }
        })
        .catch((err) => {
            console.log(err);
            commonHelper.response(res, null, 500, "Failed to delete user");
        });
};

const loginUser = async (req, res) => {
    try {
        const data = req.body;

        const result = await userModel.selectUserEmail(data.email);
        const user = result.rows[0];

        if (!user) {
            commonHelper.response(res, null, 400, "Email is invalid");
        }
        const isValidPassword = bcrypt.compareSync(
            data.password,
            user.password
        );
        delete user.password;
        console.log(isValidPassword);
        if (!isValidPassword) {
            commonHelper.response(res, null, 400, "Password is invalid");
        }

        const payload = {
            email: user.email,
            id: user.id,
        };

        const token = authHelper.generateToken(payload);
        user.token = token;
        user.refreshToken = authHelper.generateRefreshToken(payload);

        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        commonHelper.response(res, user, 200, "Login is successful");
    } catch (err) {
        console.log(err);
        commonHelper.response(res, null, 500, "Login failed");
    }
};

const refreshToken = (req, res) => {
    const decoded = jwt.verify(
        req.body.refreshToken,
        process.env.SECRET_KEY_JWT
    );
    let payload = {
        email: decoded.email,
        id: decoded.id,
    };
    const result = {
        token: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res, result, 200, "Token refreshed");
};

module.exports = {
    getAllUsers,
    getDetailUser,
    registerUser,
    deleteUser,
    updateUser,
    loginUser,
    refreshToken,
};
