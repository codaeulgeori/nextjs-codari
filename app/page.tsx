//! Pages in the app directory are Server Components by default. (This is different from the pages directory where pages are Client Components.)
//!

// 기본 서버 컴포넌트이다.
// app에서 데이터 페칭부분이 변경되었는데 getSeriverSideProps, getStaticProps, getInitialProps는 더 간단한 API로 대체되었음
// page.tsx는 기존 index.tsx와 동일하다.

// 추천하는 마이그래에션 메인 과정
// 첫번째: 페이지컴포넌트를 Client component로 내보낸다.
// 두번째: 새로운 Client component를 /app에 있는 page.tsx 파일에서 import 한다.
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
