import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import styles from './index.module.scss';
import cName from 'classnames';
import { Pagination } from '@douyinfe/semi-ui';
import axios from 'axios';
import { LOCALDOMAIN } from '@/utils';
import { IArticleIntro } from './api/articleIntro';
import Link from 'next/link';
import { ThemeContext } from '@/stores/theme';

interface IProps {
  title: string;
  description: string;
  articles: {
    list: {
      label: string;
      info: string;
      link: string;
    }[];
    total: number;
  };
}

const Home: NextPage<IProps > = ({ title, description, articles }) => {
  const [content, setContent] = useState(articles);
  const mainRef = useRef<HTMLDivElement>(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    mainRef.current?.classList.remove(styles.withAnimation);
    window.requestAnimationFrame(() => {
      mainRef.current?.classList.add(styles.withAnimation);
    });
  }, [theme]);

  return (
    <div className={styles.container}>
      <main className={cName([styles.main, styles.withAnimation])} ref={mainRef}>
        <div
          className={cName({
            [styles.header]: true,
          })}
        />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.grid}>
          {content?.list?.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className={styles.card}>
                <h2>{item.label} &rarr;</h2>
                <p>{item.info}</p>
              </div>
            </Link>
          ))}


          {/* 分页 */}
          <div className={styles.paginationArea}>
            <Pagination
              total={content?.total}
              pageSize={6}
              onPageChange={(pageNo: number): void => {
                axios
                  .post(`${LOCALDOMAIN}/api/articleIntro`, {
                    pageNo,
                    pageSize: 6,
                  })
                  .then(({ data }) => {
                    setContent({
                      list: data.list.map((item: IArticleIntro) => ({
                        label: item.label,
                        info: item.info,
                        link: `${LOCALDOMAIN}/article/${item.articleId}`,
                      })),
                      total: data.total,
                    });
                  });
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export const getStaticProps = async (): Promise<IProps> => {
  const { data: homeData } = await axios.get(`${LOCALDOMAIN}/api/home`);
  const { data: articleData } = await axios.post(`${LOCALDOMAIN}/api/articleIntro`, {
    pageNo: 1,
    pageSize: 6,
  });
  return {
    title: homeData.title,
    description: homeData.description,
    articles: {
      list: articleData.list.map((item: IArticleIntro) => ({
        label: item.label,
        info: item.info,
        link: `${LOCALDOMAIN}/article/${item.articleId}`,
      })),
      total: articleData.total,
    },
  };
}

export default Home;
