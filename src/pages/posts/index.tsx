import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts(){
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>24 de agosto de 2022</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>Int his guide, you will learn how to create a Monorepo</p>
          </a>

          <a href="#">
            <time>24 de agosto de 2022</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>Int his guide, you will learn how to create a Monorepo</p>
          </a>

          <a href="#">
            <time>24 de agosto de 2022</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>Int his guide, you will learn how to create a Monorepo</p>
          </a>
        </div>
      </main>
    </>
  )

}