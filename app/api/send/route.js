import { HamroGodamWelcomeEmail } from '@/components/EmailTemplate'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request) {
  try {
    const data = await resend.emails.send({
      from: 'HamroGodam <welcome@resend.dev>',
      to: ['manashlamichhane5@gmail.com'],
      subject: 'Welcome to HamroGodam',
      react: HamroGodamWelcomeEmail({ 
        userName: "Manash Lamichhane",
        userEmail: "manashlamichhane5@gmail.com",
        tempPassword: "your-temp-password"
      }),
    });

    return Response.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
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