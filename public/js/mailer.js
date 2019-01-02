const nodemailer = require('nodemailer');
require("dotenv").config();

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

// might need this: https://www.youtube.com/redirect?v=YU3qstG74nw&redir_token=iBxCZce_o3DaxvPIpvnvf57xvRh8MTU0NTg3MDIwNEAxNTQ1NzgzODA0&event=video_description&q=https%3A%2F%2Fwww.google.com%2Fsettings%2Fsecurity%2Flesssecureapps

nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', //originally, it was "smtp.ethereal.email"
        port: 465,
        secure: true,
        //we removed the port number and the secure statment because those were strictly for receiving on nodemailer's end
        auth: {
            
            type: 'OAuth2',
            
            user: process.env.GMAIL_USER, //account.user, // generated ethereal user
            pass: process.env.GMAIL_PASS //account.pass // generated ethereal password

            /*
            clientID: is the registered client id of the application
            clientSecret: the registered client secret of the application
            expires: an optional expiration time for the current accessToken
            refreshToken: an optional refresh token, like resets one if the other one expires of fails
            accessToken: the access token for the user, you need it if refreshtoken doesn't work 
            */

        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"The Diamond Group 👻" <lppernell1998@gmail.com>', // sender address
        to: 'o5870957@nwytg.net',//lppernell1998@gmail.com', // list of receivers
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
});

module.exports = nodemailer;