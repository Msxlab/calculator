import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendQuoteEmail = async (quote: any, pdfBuffer: Buffer) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: quote.customerInfo.email,
    subject: `Your Quote from United Granite - #${quote.id}`,
    html: `
      <h1>Thank you for your interest!</h1>
      <p>Dear ${quote.customerInfo.name},</p>
      <p>Please find attached your quote for your countertop project.</p>
      <p>Total Amount: $${quote.totalPrice}</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <br>
      <p>Best regards,</p>
      <p>United Granite Team</p>
    `,
    attachments: [
      {
        filename: `Quote-${quote.id}.pdf`,
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};