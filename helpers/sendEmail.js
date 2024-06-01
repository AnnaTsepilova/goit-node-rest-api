import "dotenv/config";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { BASE_URL, BASE_EMAIL, PORT } = process.env;

const sendEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: BASE_EMAIL,
    subject: "Verification email",
    text: "Thank you for registration. Verificate your email",
    html: `<a href="${BASE_URL}:${PORT}/api/users/verify/${verificationToken}" target="_blank">Click to confirm registration</a>`,
  };

  return await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

export default sendEmail;
