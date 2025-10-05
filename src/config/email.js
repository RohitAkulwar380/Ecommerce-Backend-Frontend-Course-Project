const nodemailer = require('nodemailer');

function createTransport(){
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT || 587);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if(!host || !port || !user || !pass){
        console.warn("Email credentials not provided. Email notifications are disabled");   
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 425,
        auth: {user, pass}, 
   });
}

module.exports = {createTransport};