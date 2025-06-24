import React from "react";
import { APP_INFO, COMPANY_INFO } from "@/consts";

type EmailTemplateProps = {
  preheader?: string;
  title: string;
  content: React.ReactNode;
  footerText?: string;
};

export const EmailTemplate = ({
  preheader = "",
  title,
  content,
  footerText = `Salon kosmetyczny Pati. email: ${COMPANY_INFO.EMAIL} tel: ${COMPANY_INFO.PHONE}`,
}: EmailTemplateProps) => {
  return `
    <!DOCTYPE html>
    <html lang="pl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        <title>${title}</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
            }
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background-color: #2d3748;
            padding: 24px;
            text-align: center;
          }
          .header img {
            max-width: 200px;
          }
          .content {
            padding: 24px;
            color: #333;
            line-height: 1.6;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 16px 0;
            background-color: #e5989b;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          }
          .button:hover {
            background-color: #d37f82;
          }
          .preheader {
            display: none;
            max-height: 0;
            overflow: hidden;
            font-size: 1px;
            line-height: 1px;
            color: #ffffff;
          }
        </style>
      </head>
      <body>
        <div class="preheader">${preheader}</div>
        <div class="container">
          <div class="header">
            <img src="${APP_INFO.BASE_URL}/images/logo-transparent.png" alt="Salon Kosmetyczny Pati" />
          </div>
          <div class="content">
            <h1>${title}</h1>
            ${content}
          </div>
          <div class="footer">
            ${footerText}
          </div>
        </div>
      </body>
    </html>
  `;
};
