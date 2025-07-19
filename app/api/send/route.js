import { HamroGodamWelcomeEmail } from '@/components/EmailTemplate'
import { Resend } from 'resend';
import { verifyToken } from '@/utils/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return Response.json({ message }, { status: 401 });
  }
  try {
    // Always send to the test email for Resend sandbox mode
    const email = 'manashlamichhane5@gmail.com';
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get('userName');
    console.log('Attempting to send email to:', email, 'userName:', userName);
    const data = await resend.emails.send({
      from: 'HamroGodam <welcome@resend.dev>',
      to: [email],
      subject: 'Welcome to HamroGodam',
      react: HamroGodamWelcomeEmail({ 
        userName: userName || "New User",
        userEmail: email,
        tempPassword: "your-temp-password"
      }),
    });
    console.log('Email send result:', data);
    return Response.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { valid, message, skip } = verifyToken(request);
  if (!valid && !skip) {
    return Response.json({ message }, { status: 401 });
  }
  try {
    const body = await request.json();
    const data = await resend.emails.send({
      from: 'HamroGodam <welcome@resend.dev>',
      to: [body.email || 'manashlamichhane5@gmail.com'],
      subject: 'Welcome to HamroGodam',
      react: HamroGodamWelcomeEmail({ 
        userName: body.userName || "New User",
        userEmail: body.email || "manashlamichhane5@gmail.com",
        tempPassword: body.tempPassword || "your-temp-password"
      }),
    });

    return Response.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}