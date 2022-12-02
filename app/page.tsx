//! Pages in the app directory are Server Components by default. (This is different from the pages directory where pages are Client Components.)
//!

// 기본 서버 컴포넌트이다.
// app에서 데이터 페칭부분이 변경되었는데 getSeriverSideProps, getStaticProps, getInitialProps는 더 간단한 API로 대체되었음
// page.tsx는 기존 index.tsx와 동일하다.
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}
