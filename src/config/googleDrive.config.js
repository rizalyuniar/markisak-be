const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '../../../.env' })

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  ' https://www.googleapis.com/auth/drive.scripts',
  'https://www.googleapis.com/auth/drive.metadata',
];

const auth = new google.auth.GoogleAuth({
  credentials: {
    "type": process.env.GOOGLE_DRIVE_TYPE,
    "project_id": process.env.GOOGLE_DRIVE_PROJECT_ID,
    "private_key_id": process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
    "private_key": process.env.GOOGLE_DRIVE_PRIVATE_KEY,
    "client_email": process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_DRIVE_CLIENT_ID,
    "auth_uri": process.env.GOOGLE_DRIVE_AUTH_URI,
    "token_uri": process.env.GOOGLE_DRIVE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GOOGLE_DRIVE_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.GOOGLE_DRIVE_CLIENT_URL
  },
  scopes: SCOPES,
});

const driveService = google.drive({
  version: 'v3',
  auth: auth,
});

async function uploadFile(auth, photo) {
  // Edit File meta data
  const fileMetaData = {
    name: photo.filename,
    parents: ['1ySvzVte_BhCmGBTQy5Q1kiyrlk-dUwT1'],
  };

  const media = {
    mimeType: 'image/jpg',
    body: fs.createReadStream(photo.path),
  };

  const response = await driveService.files.create({
    resource: fileMetaData,
    media: media,
    fields: 'id',
  });

  return response.data;
}

async function deletePhoto(auth, photo) {
  // ID File photo di google drive
  const id = '1GlED7lKkzuJKwalL7RRjQKYUxvWcTG0J';
  const response = await driveService.files.delete({
    fileId: id,
  });

  return response.data;
}

async function updatePhoto(auth) {
  const media = {
    mimeType: 'image/jpg',
    body: fs.createReadStream('bg-food.jpg'),
  };

  const response = await driveService.files.update({
    fileId: '1y0ueYdm6j9KLhq51c0qnao1zchuyDsRc',
    media: media,
    fields: 'id',
  });

  return response.data;
}

updatePhoto(auth)
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

// deletePhoto(auth)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// uploadFile(auth)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
