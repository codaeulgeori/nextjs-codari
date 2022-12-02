// You should use the head.js special file to manage <head> HTML elements that change between route segments.
// In the app directory, next/head is replaced with a new head.js special file.

// 헤더관련은 이 파일이 대신한다.(특수한 파일)
export default function Head() {
  return (
    <>
      <title>Codari123</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
