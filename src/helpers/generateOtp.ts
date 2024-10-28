import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import { emailTypes } from "@/app/enums";
import { getFutureDate } from './getFutureDate';

export const sendEmail = async(email: string, emailType: string, userId: number | string) => {
    try {
        // Generate a six digit number using the crypto module
        const otp:number = crypto.randomInt(100000, 999999)

        // Create a hashed otp
        const hashedOtp = await bcryptjs.hash(otp.toString(), 10)

        // Save otp data in the database
        const futureDate = getFutureDate(10)
        if (emailType === emailTypes.verify){
            await User.findByIdAndUpdate(userId, {
                verifyOtp: hashedOtp, verifyOtpExpiryDate: futureDate // 10min
            })
        } else if (emailType === emailTypes.resetPassword){
            await User.findByIdAndUpdate(userId, {
                forgotPasswordOtp: hashedOtp, forgotPasswordOtpExpiry: futureDate // 10min
            })
        }

        // Create a transporter object for smtp
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use false for STARTTLS; true for SSL on port 465
            auth: {
                user: process.env.SMTP_GMAIL_ADDRESS,
                pass: process.env.SMTP_GMAIL_ADDRESS_PASS,
            }
        });
        // var transport = nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //       user: "68a2ac274637d3",
        //       pass: "15c7c17d937dff"
        //     }
        // });

        // Send mail
        const mailOptions = {
            from: "fornelbatoul@gmail.com",
            to: email,
            subject: emailType === emailTypes.verify ? "Verification Otp": "Reset password Otp",
            html: emailHtml(otp, emailType === emailTypes.verify ? "Thank you for Signing up with Scheduleia": "Reset your password", emailType === emailTypes.verify ? "Verify Your email address and start using our amazing services !": "")
        }
        const mailresponse = await transport.sendMail(mailOptions)
        
        return mailresponse;
    } catch (e: any) {
        throw new Error(e.message);
    }
}

// Email UI in user's gmail inbox
const emailHtml = function(otp: number, title: string, description: string):string { return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title></title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]>-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta content="target-densitydpi=device-dpi" name="viewport" />
<meta content="true" name="HandheldFriendly" />
<meta content="width=device-width" name="viewport" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
width: 100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
.gmail-mobile-forced-width {
display: none;
display: none !important;
}
body, a, li, p, h1, h2, h3 {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
html {
-webkit-text-size-adjust: none !important
}
body, #innerTable {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
#innerTable img+div {
display: none;
display: none !important
}
img {
Margin: 0;
padding: 0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
line-height: inherit;
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
width: 100%!important;
max-width: 100%!important;
display: inline-block!important;
border: 0;
padding: 0;
margin: 0
}
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
u + #body a {
color: inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
color: inherit;
text-decoration: none
}
</style>
<style type="text/css">
@media (min-width: 481px) {
.hd { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.hm { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.t26{padding:30px 30px 40px!important;width:340px!important}.t19,.t32,.t34{width:320px!important}.t34{padding-left:40px!important;padding-right:40px!important}.t11,.t15,.t24{width:340px!important}
}
</style>
<style type="text/css">@media (max-width: 480px) {[class~="x_t26"]{padding-left:30px!important;padding-top:30px!important;padding-bottom:40px!important;padding-right:30px!important;width:340px!important;} [class~="x_t19"]{width:320px!important;} [class~="x_t34"]{padding-left:40px!important;padding-right:40px!important;width:320px!important;} [class~="x_t32"]{width:320px!important;} [class~="x_t11"]{width:340px!important;} [class~="x_t15"]{width:340px!important;} [class~="x_t24"]{width:340px!important;}}</style>
<!--[if !mso]>-->
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600;700&amp;family=Albert+Sans:wght@800&amp;display=swap" rel="stylesheet" type="text/css" />
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body id="body" class="t39" style="min-width:100%;Margin:0px;padding:0px;background-color:#000000;"><div class="t38" style="background-color:#000000;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t37" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#000000;" valign="top" align="center">
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color="#000000"/>
</v:background>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td align="center">
<table class="t4" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="400" class="t3" style="padding:40px 40px 40px 40px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t3" style="width:320px;padding:40px 40px 40px 40px;">
<!--<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
<table class="t2" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="55" class="t1">
<![endif]-->
<!--[if !mso]>-->
<td class="t1" style="width:55px;">
<!--<![endif]-->
<div style="font-size:0px;"><img class="t0" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="55" height="36.4375" alt="" src="https://179f71e6-b46e-48df-8165-cbc51aacf401.b-cdn.net/e/bfa5c7e7-9de2-4bbe-af18-1b01331471a4/e12fcfc0-255e-4fc0-86dd-2e2d4be3ff8c.png"/></div></td>
</tr></table>
</td></tr></table></td>
</tr></table>
</td></tr><tr><td align="center">
<table class="t29" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="400" class="t28" style="background-color:#FFFFFF;">
<![endif]-->
<!--[if !mso]>-->
<td class="t28" style="background-color:#FFFFFF;width:400px;">
<!--<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
<table class="t9" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="400" class="t8" style="background-color:#059669;padding:40px 40px 40px 40px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t8" style="background-color:#059669;width:320px;padding:40px 40px 40px 40px;">
<!--<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
<table class="t7" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="200" class="t6">
<![endif]-->
<!--[if !mso]>-->
<td class="t6" style="width:200px;">
<!--<![endif]-->
<div style="font-size:0px;"><img class="t5" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="200" height="200" alt="" src="https://179f71e6-b46e-48df-8165-cbc51aacf401.b-cdn.net/e/bfa5c7e7-9de2-4bbe-af18-1b01331471a4/998e1459-fb26-441f-9cd1-966a81dc68eb.png"/></div></td>
</tr></table>
</td></tr></table></td>
</tr></table>
</td></tr><tr><td align="center">
<table class="t27" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="400" class="t26" style="padding:40px 60px 50px 60px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t26" style="width:280px;padding:40px 60px 50px 60px;">
<!--<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
<table class="t12" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="280" class="t11">
<![endif]-->
<!--[if !mso]>-->
<td class="t11" style="width:280px;">
<!--<![endif]-->
<h1 class="t10" style="margin:0;Margin:0;font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:35px;font-weight:800;font-style:normal;font-size:30px;text-decoration:none;text-transform:none;letter-spacing:-1.2px;direction:ltr;color:#333333;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">${title}&nbsp;</h1></td>
</tr></table>
</td></tr><tr><td><div class="t13" style="mso-line-height-rule:exactly;mso-line-height-alt:16px;line-height:16px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="left">
<table class="t16" role="presentation" cellpadding="0" cellspacing="0" style="Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="280" class="t15">
<![endif]-->
<!--[if !mso]>-->
<td class="t15" style="width:280px;">
<!--<![endif]-->
<p class="t14" style="margin:0;Margin:0;font-family:Inter Tight,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:21px;font-weight:400;font-style:normal;font-size:14px;text-decoration:none;text-transform:none;direction:ltr;color:#555555;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">${description}</p></td>
</tr></table>
</td></tr><tr><td><div class="t17" style="mso-line-height-rule:exactly;mso-line-height-alt:30px;line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t20" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="280" class="t19" style="background-color:#059669;overflow:hidden;text-align:center;line-height:24px;mso-line-height-rule:exactly;mso-text-raise:2px;padding:10px 10px 10px 10px;border-radius:10px 10px 10px 10px;">
<![endif]-->
<!--[if !mso]>-->
<td class="t19" style="background-color:#059669;overflow:hidden;width:260px;text-align:center;line-height:24px;mso-line-height-rule:exactly;mso-text-raise:2px;padding:10px 10px 10px 10px;border-radius:10px 10px 10px 10px;">
<!--<![endif]-->
<span class="t18" style="display:block;margin:0;Margin:0;font-family:Inter Tight,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:24px;font-weight:600;font-style:normal;font-size:16px;text-decoration:none;direction:ltr;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">
otp: ${otp}
</span></td>
</tr></table>
</td></tr><tr><td><div class="t23" style="mso-line-height-rule:exactly;mso-line-height-alt:12px;line-height:12px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t25" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="280" class="t24">
<![endif]-->
<!--[if !mso]>-->
<td class="t24" style="width:280px;">
<!--<![endif]-->
<p class="t22" style="margin:0;Margin:0;font-family:Inter Tight,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:21px;font-weight:400;font-style:normal;font-size:14px;text-decoration:none;text-transform:none;direction:ltr;color:#555555;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">This token is valid for 10 min</p></td>
</tr></table>
</td></tr></table></td>
</tr></table>
</td></tr></table></td>
</tr></table>
</td></tr><tr><td><div class="t30" style="mso-line-height-rule:exactly;mso-line-height-alt:30px;line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
<table class="t35" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="400" class="t34">
<![endif]-->
<!--[if !mso]>-->
<td class="t34" style="width:400px;">
<!--<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
<table class="t33" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
<tr>
<!--[if mso]>
<td width="400" class="t32">
<![endif]-->
<!--[if !mso]>-->
<td class="t32" style="width:400px;">
<!--<![endif]-->
<p class="t31" style="margin:0;Margin:0;font-family:Inter Tight,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:18px;font-weight:400;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#555555;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">@copyright. All rights reserved</p></td>
</tr></table>
</td></tr></table></td>
</tr></table>
</td></tr><tr><td><div class="t36" style="mso-line-height-rule:exactly;mso-line-height-alt:100px;line-height:100px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr></table></td></tr></table></div><div class="gmail-mobile-forced-width" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
</div></body>
</html>
`}