import SibApiV3Sdk from "@sendinblue/client";

const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
brevoClient.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOTPEmail = async (toEmail, otp) => {
  const email = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: toEmail }],
    sender: { email: "no-reply@yourdomain.com", name: "MyApp" },
    subject: "Your OTP Code",
    htmlContent: `<p>Your OTP code is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    textContent: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  });

  return brevoClient.sendTransacEmail(email);
};

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
