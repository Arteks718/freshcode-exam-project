const nodemailer = require('nodemailer');
const CONSTANTS = require('../constants');
const ServerError = require('../errors/ServerError');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.email',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

const createOfferResponseMessage = (name, status, reason, contestName, companyLogo) => {
  let message = `<p><b>Hi ${name},</b></p>`;

  if (status === CONSTANTS.OFFER_STATUS_APPROVED) {
    message += `<p>Your offer on contests ${contestName} has been <b>approved</b>! We appreciate your contribution.</p>`;
  } else if (status === CONSTANTS.OFFER_STATUS_DECLINED) {
    message += `<p>We regret to inform you that your offer has been <b>rejected</b> by moderator.</p>`;
    if (reason) {
      message += `<p><b>Reason:</b> ${reason}</p>`;
    }
  } else {
    message += `<p>The status of your offer has been updated.</p>`;
  }

  message += `<p>Thank you for participating in our contest.</p>`;
  message += `<p>Best regards,<br/>Squadhelp Team</p>`;
  message += `<p><img src="cid:${companyLogo}" alt="Company Logo" style="max-width:150px; margin-top: 10px" /></p>`;

  return message;
};

module.exports.sendOfferMessage = (
  creativeEmail,
  creativeName,
  offerStatus,
  offerReason,
  contestName
) => {
  const message = {
    from: `"Squadhelp Team" <${process.env.NODEMAILER_AUTH_USER}>`,
    to: creativeEmail,
    subject: 'Offer Response',
    html: createOfferResponseMessage(creativeName, offerStatus, offerReason, contestName, 'companyLogo'),
    attachments: [{
      filename: 'companyLogo.png',
      path: `${CONSTANTS.STATIC_IMAGES_PATH}/blue-logo.png`,
      cid: 'companyLogo',
    }]
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      new ServerError(err.message)
      return process.exit(1);
    }
  });
};