import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite:"none",
      secure:true
    })
    .json({
      success: true,
      message: message,
    });
};

export const sendMail = (user, res, statusCode = 200) => {
  console.log(user.role);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "suvankarmahato621@gmail.com",
      pass: "qpak ytel xcqt egrb", // make sure to use a valid app password
    },
  });
  let mailOptions = {};
  if (user.role === "Participants") {
    mailOptions = {
      from: {
        name: "CodeQuest",
        address: "suvankarmahato621@gmail.com",
      },
      to: [user.email], // list of receivers
      subject: "Welcome to CodeQuest!",
      text: "Dear User,\n\nThank you for registering on our website. We are excited to have you on board and look forward to your participation in our events.\n\nBest Regards,\nCodeQuest Team",
      html: "<p>Dear User,</p><p>Thank you for registering on our website. We are excited to have you on board and look forward to your participation in our events.</p><p>Best Regards,<br>CodeQuest Team</p>",
    };
  } else if (user.role === "Judge") {
    mailOptions = {
      from: {
        name: "CodeQuest",
        address: "suvankarmahato621@gmail.com",
      },
      to: [user.email], // list of receivers
      subject: "Congratulations! You've been chosen as a judge",
      text: "Dear Judge,\n\nWe are pleased to inform you that you have been chosen as a judge for our upcoming event. Thank you for your expertise and willingness to participate.\n\nBest Regards,\nCodeQuest Team",
      html: "<p>Dear Judge,</p><p>We are pleased to inform you that you have been chosen as a judge for our upcoming event. Thank you for your expertise and willingness to participate.</p><p>Best Regards,<br>CodeQuest Team</p>",
    };
  }

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Mail sent");
    } catch (error) {
      console.log(error);
    }
  };

  sendMail(transporter, mailOptions);
};

export const sendMailContets = (user, res, statusCode = 200) => {
  console.log(user.role);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "suvankarmahato621@gmail.com",
      pass: "qpak ytel xcqt egrb", // make sure to use a valid app password
    },
  });

  const mailOptions = {
    from: {
      name: "CodeQuest",
      address: "suvankarmahato621@gmail.com",
    },
    to: [user.email], // list of receivers
    subject: "Team Registration Successful",
    text: `Dear Participant,\n\nYour team "${teamName}" has been successfully registered for the contest. We look forward to your participation.\n\nBest Regards,\nCodeQuest Team`,
    html: `<p>Dear Participant,</p><p>Your team <b>"${teamName}"</b> has been successfully registered for the contest. We look forward to your participation.</p><p>Best Regards,<br>CodeQuest Team</p>`,
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Mail sent");
    } catch (error) {
      console.log(error);
    }
  };

  sendMail(transporter, mailOptions);
};
