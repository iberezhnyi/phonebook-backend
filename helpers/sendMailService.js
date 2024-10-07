import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

export const sendMailService = async ({
  email,
  subject = "Welcome to your contacts!",
  verificationToken,
}) => {
  await transport.sendMail({
    to: email,
    from: "iberezhnyi81@gmail.com",
    subject: subject,
    html: `<h1 style='color: red'>To confirm your registration, please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a></h1>`,
    text: `To confirm your registration, please open this link http://localhost:3000/api/users/verify/${verificationToken}`,
  });
};
