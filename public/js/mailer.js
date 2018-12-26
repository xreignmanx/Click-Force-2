const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'Gmail', //originally, it was "smtp.ethereal.email"
        //we removed the port number and the secure statment because those were strictly for receiving on nodemailer's end
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"The Diamond Group 👻" <clickforceGame@gmail.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Authenticate Your Account Now! ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<h1>Hello New User!</h1><b>Welcome to the game of click force!<hr>Click the link below to authenticate your new account!/b>' // html body
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