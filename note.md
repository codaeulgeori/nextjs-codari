1. 클라이언트 컴포넌트 만들기

- app 디렉토리 안에 Client 컴포넌트를 export하는 새로운 파일을 만든다.
- 클라이언트 컴포넌트를 정의하려면 최상단에 'use client' 키워드를 작성해준다.

```javascript
'use client';

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

2. 새로운 페이지 만들기

- 서버 컴포넌트에서 클라이언트 컴포넌트를 import 한다.
- 원래 컴포넌트에 데이터 페칭 부분이 있다면 서버컴포넌트로 옮긴다.

```javascript
// Import your Client Component
import HomePage from './HomePage';

async function getPosts() {
  const res = await fetch('https://...');
  const posts = await res.json();
  return posts;
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const recentPosts = await getPosts();
  // Forward fetched data to your Client Component
  return <HomePage recentPosts={recentPosts} />;
}
```

3. Static Site Generation

- 기본 cache: force-cache가 적용되고 수동으로 invalidation하지 않으면 계속 캐싱됨
- fetch 관련 자세한내용 [여기서](https://beta.nextjs.org/docs/api-reference/fetch) 확인

```javascript
// before
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://...`);
  const projects = await res.json();

  return { props: { projects } };
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>);
}


// after
// `app` directory

// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`);
  const projects = await res.json();

  return projects;
}

export default async function Index() {
  const projects = await getProjects();

  return projects.map((project) => <div>{project.name}</div>);
}

```

3. getStaticPaths는 generateStaticParams로 대체됨

```javascript
// `app` directory

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  return post;
}

export default async function Post({ params }) {
  const post = await getPost(params);

  return <PostLayout post={post}>
}
```

4. 스타일링

- 글로벌은 \_app.tsx에서 제한되었는데 app에서는 해당 제한이 해제되었고 전역 스타일은 모든 레이아웃 또는 페이지, 컴포넌트에 추가될수 있다.

- sass 사용
- next에서는 sass, scss 모두 빌트인되어있고 .module.scss를 사용할 수 있다.

```bash
yarn add -D sass
```

- sass 옵션

```javascript
const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  }
};
```

- sass 변수

```javascript
app/variables.module.scss
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

- app/page.tsx

```javascript
// maps to root `/` URL

import variables from './variables.module.scss';

export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1>;
}
```

- 글로벌 스타일 사용하기 -> layout.tsx에서 글로벌 css를 import하면 끝

```javascript
// These styles apply to every route in the application
import './global.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- 스타일드 컴포넌트 사용하기

```javascript
// lib/styled-components.tsx
import React from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function useStyledComponentsRegistry() {
  const [styledComponentsStyleSheet] = React.useState(
    () => new ServerStyleSheet(),
  );

  const styledComponentsFlushEffect = () => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    // Alternatively, you can use `styledComponentsStyleSheet.seal()`
    // But when using Suspense boundaries, the styles should be cleared:
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  };

  const StyledComponentsRegistry = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children as React.ReactElement}
    </StyleSheetManager>
  );

  return [StyledComponentsRegistry, styledComponentsFlushEffect] as const;
}


// app/RootStyleRegistry.tsx
'use client';

import { useStyledComponentsRegistry } from '../lib/styled-components';
import { useServerInsertedHTML } from 'next/navigation';

export default function RootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [StyledComponentsRegistry, styledComponentsFlushEffect] =
    useStyledComponentsRegistry();

  useServerInsertedHTML(() => {
    return <>{styledComponentsFlushEffect()}</>;
  });

  return <StyledComponentsRegistry>{children}</StyledComponentsRegistry>;
}


// app/layout.js
import RootStyleRegistry from './RootStyleRegistry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}



```
