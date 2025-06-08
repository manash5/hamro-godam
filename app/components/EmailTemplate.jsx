import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { Img } from "@react-email/components";

// Using a direct public URL for testing
const LOGO_URL = 'https://i.postimg.cc/tCrZXTby/logo.png'; // This is a placeholder logo - replace with your actual hosted logo URL

export const HamroGodamWelcomeEmail = ({
  userName = "User",
  userEmail = "user@example.com",
  tempPassword = "tempPassword123"
}) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#1e40af', // Rich blue
                brandLight: '#3b82f6', // Lighter blue
                brandDark: '#1e3a8a', // Darker blue
                accent: '#10b981', // Emerald green
                offwhite: '#f8fafc',
                lightBlue: '#eff6ff', // Very light blue background
                credentialsBg: '#f0f9ff', // Light blue for credentials box
                textGray: '#64748b',
                textDark: '#1e293b',
                border: '#e2e8f0',
                success: '#059669',
              },
              spacing: {
                0: '0px',
                8: '8px',
                12: '12px',
                15: '15px',
                18: '18px',
                20: '20px',
                24: '24px',
                30: '30px',
                32: '32px',
                40: '40px',
                45: '45px',
                48: '48px',
                60: '60px',
              },
              borderRadius: {
                'xl': '12px',
                '2xl': '16px',
              },
            },
          },
        }}
      >
        <Preview>🎉 Welcome to Hamro Godam - Your Premium Warehouse Management Solution</Preview>
        <Body className="bg-offwhite font-sans text-base leading-relaxed m-0 p-0">
          
          {/* Decorative Header Bar */}
          <Section className="bg-gradient-to-r from-brand to-brandLight h-2"></Section>

          {/* Main Content Container */}
          <Container className="mx-auto max-w-2xl mt-24">
            <div className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
              
              {/* Header with Logo and Brand */}
              <Section className="bg-gradient-to-r from-lightBlue to-credentialsBg text-center py-40 px-40">
                <div className="inline-flex items-center justify-center ">
                  <div className="bg-white px-8 rounded-xl shadow-sm flex items-center justify-center space-x-2">
                    <Img
                      src={LOGO_URL}
                      width="25"
                      height="25"
                      alt="Hamro Godam Logo"
                      className="block mt-1"
                    />
                    <Text className="text-2xl font-bold text-brand m-0 tracking-tight mb-2">
                      Hamro Godam
                    </Text>
                  </div>
                </div>
                <Text className="text-sm text-textGray mb-24 font-medium tracking-wide">
                  WAREHOUSE MANAGEMENT
                </Text>
                
                <Heading className="text-3xl font-bold text-textDark mb-12 leading-tight">
                  Welcome Aboard! 🎉
                </Heading>
                <Text className="text-lg text-textGray m-0 font-medium">
                  Your warehouse management journey starts here
                </Text>
              </Section>

              {/* Main Content */}
              <Section className="px-40 py-32">
                <Text className="text-lg text-textDark mb-24 font-medium">
                  Hello {userName}! 👋
                </Text>
                
                <Text className="text-base text-textGray mb-24 leading-relaxed">
                  We're absolutely thrilled to welcome you to <strong className="text-brand">Hamro Godam</strong>, 
                  your comprehensive warehouse management solution designed to streamline inventory control 
                  and supercharge operational efficiency.
                </Text>

                <div className="bg-lightBlue border-l-4 border-brand p-20 rounded-r-xl mb-32">
                  <Text className="text-base text-textDark mb-15 font-semibold flex items-center">
                    ✨ Why you'll love Hamro Godam:
                  </Text>
                  <Text className="text-sm text-textGray m-0 leading-relaxed">
                    Built with cutting-edge technology focusing on simplicity, reliability, and scalability. 
                    Our platform revolutionizes warehouse management with powerful automation that reduces 
                    manual work and boosts accuracy.
                  </Text>
                </div>
              </Section>

              {/* Credentials Section */}
              <Section className="px-40 pb-32">
                <Text className="text-base text-textDark mb-20 font-semibold flex items-center">
                  🔑 Your Login Credentials
                </Text>
                
                <div className="bg-gradient-to-br from-credentialsBg to-lightBlue border-2 border-brand/20 rounded-xl p-24 mb-20">
                  <Row>
                    <Column>
                      <Text className="text-sm text-textGray mb-8 font-medium uppercase tracking-wide">
                        Email Address
                      </Text>
                      <Link 
                        href={`mailto:${userEmail}`}
                        className="text-brand text-base font-semibold underline decoration-2 underline-offset-2 hover:text-brandDark"
                      >
                        {userEmail}
                      </Link>
                    </Column>
                  </Row>
                  
                  <div className="border-t border-brand/10 my-18"></div>
                  
                  <Row>
                    <Column>
                      <Text className="text-sm text-textGray mb-8 font-medium uppercase tracking-wide">
                        Temporary Password
                      </Text>
                      <div className="bg-white px-15 py-12 rounded-lg border border-border inline-block">
                        <Text className="text-base font-mono font-bold text-textDark m-0 tracking-wider">
                          {tempPassword}
                        </Text>
                      </div>
                    </Column>
                  </Row>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-20">
                  <Text className="text-sm text-amber-800 mb-8 font-semibold flex items-center">
                    🔒 Security Reminder
                  </Text>
                  <Text className="text-sm text-amber-700 m-0 leading-relaxed">
                    Please change your password immediately after your first login to ensure account security.
                  </Text>
                </div>
              </Section>

              {/* Call to Action */}
              <Section className="text-center px-40 pb-40">
                <Button 
                  href="#"
                  className="inline-block bg-gradient-to-r from-brand to-brandLight text-white px-32 py-18 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🚀 Access Your Dashboard
                </Button>
                
                <Text className="text-sm text-textGray mt-15 m-0">
                  Click the button above to get started with your warehouse management
                </Text>
              </Section>

              {/* Support Section */}
              <Section className="bg-slate-50 px-40 py-32 border-t border-border">
                <div className="text-center">
                  <Text className="text-base text-textDark mb-15 font-semibold">
                    Need Help? We're Here! 💬
                  </Text>
                  <Text className="text-sm text-textGray mb-20 leading-relaxed">
                    Our support team is ready to help you make the most of Hamro Godam.
                  </Text>
                  <Link 
                    href="mailto:support@hamrogodam.com"
                    className="inline-flex items-center text-brand font-medium text-sm underline decoration-2 underline-offset-2 hover:text-brandDark"
                  >
                    📧 support@hamrogodam.com
                  </Link>
                </div>
              </Section>

              {/* Closing */}
              <Section className="px-40 py-32 text-center">
                <Text className="text-base text-textGray mb-8">
                  Welcome to the future of warehouse management! 🌟
                </Text>
                <Text className="text-base text-textDark font-semibold m-0">
                  The Hamro Godam Team
                </Text>
              </Section>
            </div>
          </Container>

          {/* Footer */}
          <Container className="mx-auto max-w-2xl">
            <Section className="text-center py-32">
              <div className="border-t border-border pt-24">
                <Text className="text-sm text-textGray mb-8">
                  © 2024 Hamro Godam. All rights reserved.
                </Text>
                <Text className="text-xs text-textGray/70 m-0">
                  This is an automated message, please do not reply directly to this email.
                </Text>
              </div>
            </Section>
          </Container>

          {/* Bottom Decorative Bar */}
          <Section className="bg-gradient-to-r from-brand to-brandLight h-1"></Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

HamroGodamWelcomeEmail.PreviewProps = {
  userName: "Sandis Prajapati",
  userEmail: "manashlamichhane@gmail.com",
  tempPassword: "password123"
};