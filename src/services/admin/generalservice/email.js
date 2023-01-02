import config from "../../../config";
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(config.SG_KEY)

export const sendWelcomeEmail = (email, name, password) => {
  sgMail.send({
    to: 'khansanad986@gmail.com', //replace with email
    from: 'skhan@nextlooptechnologies.com',
    subject: 'Thanks for Joining In!',
    text: `Welcome to BBE ${name}, your id is ${email} and password is ${password}` 
  }).then(() => {
    console.log("Email Sent", config.SG_KEY);
  }).catch((error) => {
    console.log("From email service ",error)
  });
}

export const sendForgotPasswordEmail = (email, name, resetToken) => {
  sgMail.send({
    from: 'skhan@nextlooptechnologies.com',
    to: 'skhan@nextlooptechnologies.com',  // replace with email
    subject: 'Forgot Password OTP',
    html: `<p>Hi ${name}, </p>
          <p>You requested to reset password</p>
          <p> Please, click the link below to reset password </p>
          <a href="https://blue-bird-events-blue-bird-events.vercel.app/passwordReset?token=${resetToken}">Reset Password</a>` 
  });
}

