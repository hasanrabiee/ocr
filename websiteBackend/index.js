const express = require("express")
const dotenv = require("dotenv")
const multer = require("multer")
// const adminRouter = require("./routers/admin/admin")
const axios = require("axios")
dotenv.config();
const cors = require('cors');
const path = require("path");
// mongodb://root:123456@mongodb:27017/bezkoder_db?authSource=admin
const FormData = require('form-data');


const app = express();

function checkFileType(file, cb) {
    // Allowed ext

    const filetypes = /jpeg|jpg|png|mp3|mp4|glb/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(null, false);
    }
}

const storage = multer.diskStorage({
    destination: './public/uploads/',

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
});
const upload = multer({storage: storage})

app.use(express.static('public'));

const port = process.env.PORT || 4000;
const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ],
    allowedHeaders: "*",
    ExposeHeaders: [
        "ETag"
    ]
};

app.use(cors(corsOpts));
app.use(express.json())
// app.use(adminRouter)
app.get('/', (req, res) => {
    res.send({msg: "server is alive"});
});

app.post("/upload", upload.single("file"), (req, res) => {
    res.status(201).json({
        url: `${process.env.BACKEND_URL}/uploads/${req.file.filename}`,
        ext: path.extname(req.file.originalname)
    });
})

app.post("/convert", async (req, res) => {
    const form = new FormData();
    form.append("url", req.body.url)
    if (req.body.ext === '.pdf') {
        const texts = []
        // console.log(req.body.url)

        try {
            const response = await axios.post(`${process.env.OCR_URL}/convertPdf`, form)
            response.data.text.map(t => (
                texts.push(t.text)
            ))
            return res.status(200).json({
                text: texts.toString()
            });
        } catch (e) {
            console.log(e)
        }
    } else {
        try {
            const response = await axios.post(`${process.env.OCR_URL}/convert`, form)
            console.log(response.data)
            return res.status(200).json({
                text: response.data.text
            });
        } catch (e) {
            console.log(e)
        }

    }
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
