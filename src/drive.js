const { google } = require('googleapis');

const scopes = [
    'https://www.googleapis.com/auth/drive'
];

function auth() {
    const credentials = require('../credentials.json');
    return new google.auth.JWT(
        credentials.client_email, null,
        credentials.private_key, scopes
    );
}

exports.drive = function() {
    return google.drive({ version: 'v3', auth: auth() });
};
