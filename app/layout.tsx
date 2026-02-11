import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Chatbot from "@/components/ui/Chatbot";
import { QuizProvider } from "@/lib/QuizContext";
import { SubjectProvider } from "@/lib/SubjectContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduGap - Identify and Close Your Learning Gaps",
  description: "Diagnostic assessment platform to identify knowledge gaps and provide targeted remediation for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QuizProvider>
          <SubjectProvider>
            <Header />
            {children}
            <Chatbot />
          </SubjectProvider>
        </QuizProvider>
      </body>
    </html>
  );
}
