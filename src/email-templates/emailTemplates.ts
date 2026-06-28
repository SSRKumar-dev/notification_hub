export function createSecurityAlertHtml({
  name,
  loginTime,
  device,
  location,
  ipAddress,
}: {
  name: string;
  loginTime: string;
  device: string;
  location: string;
  ipAddress: string;
}) {
  return `<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; padding:20px;">

<h2 style="color:#ea580c;">
Security Alert 🔐
</h2>

<p>Hello ${name},</p>

<p>
We detected a new login to your account.
</p>

<div style="background:#f4f4f4; padding:15px; border-radius:8px;">

<p><b>Time:</b> ${loginTime}</p>

<p><b>Device:</b> ${device}</p>

<p><b>Location:</b> ${location}</p>

<p><b>IP Address:</b> ${ipAddress}</p>

</div>

<p>
If this was you, no action is needed.
</p>

<p>
If you do not recognize this activity, please secure your account immediately.
</p>

<br/>

<p>Regards,<br/>NotificationHub Security Team</p>

</div>`;
}

export function createWelcomeHtml({
  name,
  recipient,
  signupTime,
  frontendUrl,
}: {
  name: string;
  recipient: string;
  signupTime: string;
  frontendUrl: string;
}) {
  return `<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; padding:20px;">

  <h2 style="color:#2563eb;">
    Welcome to NotificationHub 🚀
  </h2>

  <p>Hello ${name},</p>

  <p>
    Thanks for signing up. Your account has been created successfully.
  </p>

  <div style="background:#f4f4f4; padding:15px; border-radius:8px;">
    <p><b>Email:</b> ${recipient}</p>
    <p><b>Signup Time:</b> ${signupTime}</p>
  </div>

  <p>
    You can now start creating and managing notifications.
  </p>

  <br/>

  <a href="${frontendUrl}"
     style="background:#2563eb; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
      Open Dashboard
  </a>

  <br/><br/>

  <p>Regards,<br/>NotificationHub Team</p>

</div>`;
}
