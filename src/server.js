const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const drive = require('./drive');

const app = express();
const DRIVE_ID = 'test';

app.use(cors());
app.use(bodyParser.json({type: 'application/json'}));

app.get('/files', (request, response) => {
    drive.drive().files.list(
        {
            q: "mimeType != 'application/vnd.google-apps.folder' and trashed = false", driveId: DRIVE_ID,
            supportsAllDrives: true, includeItemsFromAllDrives: true, corpora: 'drive'
        },
        (err, res) => {
            if (err) {
                console.error(err);
            } else {
                const result = [];
                res.data.files.forEach(function (file) {
                    console.log('Found file: ', file.name, file.id);
                    result.push(file.id);
                });

                response.json(result);
            }
        }
    );
});

app.get('/file/:fileId', (request, response) => {
    const fileId = request.params.fileId;

    drive.drive().files.get(
        {
            fileId: fileId, fields: '*', supportsAllDrives: true
        },
        (err, res) => {
            if (err) {
                console.error(err);
            } else {
                response.json(res.data);
            }
        }
    );
});

app.get('/stream/file/:fileId', (request, response) => {
    const fileId = request.params.fileId;
    let headers = range_header(request);

    drive.drive().files.get(
        {fileId: fileId, alt: 'media', headers: headers},
        {responseType: 'stream'},
        (err, res) => {
            res.data
                .on('end', () => {
                    console.log('Done');
                })
                .on('error', err => {
                    console.log('Error', err);
                })
                .pipe(response);
        }
    );
});

function range_header(request) {
    const start = request.headers.start;
    const end = request.headers.end;

    let headers = {};
    if (start && end) {
        headers = {"Range": `bytes=${start}-${end}`};
    }
    return headers;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('google-client listening on port', port);
});
