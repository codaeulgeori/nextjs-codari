import React from 'react';

//! The app directory must include a root layout.
//! The root layout must define <html>, and <body> tags since Next.js does not automatically create them
//! The root layout replaces the pages/_app.tsx and pages/_document.tsx files
// js, jsx, or tsx extensions can be used for layout files.

//! 기존 _app.tsx, _document.tsx 파일을 이 파일로 대체한다.
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
