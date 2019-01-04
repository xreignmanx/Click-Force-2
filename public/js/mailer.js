const nodemailer = require('nodemailer');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
            console.log('Labels:');
            labels.forEach((label) => {
                console.log(`- ${label.name}`);
            });
        } else {
            console.log('No labels found.');
        }
    });
}

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

// might need this: https://www.youtube.com/redirect?v=YU3qstG74nw&redir_token=iBxCZce_o3DaxvPIpvnvf57xvRh8MTU0NTg3MDIwNEAxNTQ1NzgzODA0&event=video_description&q=https%3A%2F%2Fwww.google.com%2Fsettings%2Fsecurity%2Flesssecureapps


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //originally, it was "smtp.ethereal.email"
    port: 465, //465 || 587
    secure: true,
    //we removed the port number and the secure statment because those were strictly for receiving on nodemailer's end
    auth: {

        type: 'OAuth2',

        user: 'lppernell1998@gmail.com',
        pass: 'Soleisdabest1@12'
        // clientId: '1030555977796-p6kepqmu0bonrh5c9g0gp2cueaqn0gcs.apps.googleusercontent.com',
        // clientSecret: 'MBprg4VQ7QyGATMtyPNYLyGp',
        // refreshToken: process.env.GMAIL_REFRESHTOKEN,
        // accessToken: process.env.GMAIL_ACCESSTOKEN

        /*
        clientID: is the registered client id of the application
        clientSecret: the registered client secret of the application
        expires: an optional expiration time for the current accessToken
        refreshToken: an optional refresh token, like resets one if the other one expires of fails
        accessToken: the access token for the user, you need it if refreshtoken doesn't work 
        */

    },
    tls: {
        // rejectUnauthorized: false,
        secureProtocol: "TLSv1_method"
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"The Diamond Group 👻" <lppernell1998@gmail.com>', // sender address
    to: 'lppernell1998@gmail.com',//lppernell1998@gmail.com', // list of receivers
    subject: 'Authenticate Your Account Now! ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<h1>Hello New User!</h1><b>Welcome to the game of click force!<hr>Click the link below to authenticate your new account!</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});


module.exports = nodemailer;