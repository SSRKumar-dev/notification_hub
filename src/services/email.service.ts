import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {
  createSecurityAlertHtml,
  createWelcomeHtml,
} from "../email-templates/emailTemplates";

dotenv.config();

export interface NotificationEmailPayload {
  notificationId: string;
  userId: string;
  recipient: string;
  message: string;
  type: string;
}

export interface EmailPayload {
  recipient: string;
  subject: string;
  html: string;
  text?: string;
}

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : undefined;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error(
      "SMTP configuration is required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS",
    );
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function getFromAddress() {
  const fromEmail =
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    "no-reply@notification-hub.local";
  const fromName = process.env.EMAIL_FROM_NAME || "NotificationHub";

  return `${fromName} <${fromEmail}>`;
}

function getReplyToAddress() {
  return (
    process.env.REPLY_TO_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.SMTP_USER ||
    "no-reply@notification-hub.local"
  );
}

export async function sendEmail(payload: EmailPayload) {
  const transporter = createTransporter();
  const headers: Record<string, string> = {};

  if (process.env.LIST_UNSUBSCRIBE_URL) {
    headers["List-Unsubscribe"] = `<${process.env.LIST_UNSUBSCRIBE_URL}>`;
  }

  await transporter.sendMail({
    from: getFromAddress(),
    replyTo: getReplyToAddress(),
    to: payload.recipient,
    subject: payload.subject,
    text: payload.text || payload.html.replace(/<[^>]+>/g, ""),
    html: payload.html,
    headers,
  });
}

export async function sendSecurityAlertEmail(payload: {
  name: string;
  recipient: string;
  loginTime: string;
  device: string;
  location: string;
  ipAddress: string;
}) {
  return sendEmail({
    recipient: payload.recipient,
    subject: "Security Alert: New Login Detected",
    html: createSecurityAlertHtml(payload),
    text: `Security alert: New login detected for ${payload.name} at ${payload.loginTime}. Device: ${payload.device}. Location: ${payload.location}. IP: ${payload.ipAddress}.`,
  });
}

export async function sendWelcomeEmail(payload: {
  name: string;
  recipient: string;
  signupTime: string;
  frontendUrl: string;
}) {
  return sendEmail({
    recipient: payload.recipient,
    subject: "Welcome to NotificationHub!",
    html: createWelcomeHtml(payload),
    text: `Welcome ${payload.name}! Your account was created at ${payload.signupTime}. Visit ${payload.frontendUrl} to get started.`,
  });
}

export async function sendEmailNotification(payload: NotificationEmailPayload) {
  await sendEmail({
    recipient: payload.recipient,
    subject: `Notification from Notification Hub`,
    text: payload.message,
    html: `<p>${payload.message}</p>`,
  });
}
