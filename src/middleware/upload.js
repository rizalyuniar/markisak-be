const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const type = file.mimetype.replaceAll("/",".")
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + "." + type.toLowerCase()
        );
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, //2 MB
    },
    fileFilter: (req, file, cb) => {
        const acceptedTypeFile = ["jpg", "png", "jpeg"];
        const extFile = file.mimetype.split("/")[1];
        if (!acceptedTypeFile.includes(extFile.toLowerCase())) {
            return cb(new createError(415, 'File extensions should be jpg, jpeg, png'));
        }
        cb(null, true);
    },
});

module.exports = upload;
