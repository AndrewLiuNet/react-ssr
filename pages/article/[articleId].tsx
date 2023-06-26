import { LOCALDOMAIN } from '@/utils';
import axios from 'axios';
import React from 'react';
import type { NextPage,GetStaticProps,GetStaticPaths  } from 'next';
import styles from './styles.module.scss';
import { IArticleIntro } from '../api/articleIntro';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const showdown = require('showdown');

export interface IArticleProps {
  title: string;
  author: string;
  description: string;
  createTime: string;
  content: string;
}

const Article: NextPage<IArticleProps> = ({ title, author, description, createTime, content }) => {
  const converter = new showdown.Converter();

  return (
    <div className={styles.article}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.info}>
        作者：{author} | 创建时间: {createTime}
      </div>
      <div className={styles.description}>{description}</div>
      <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }} className={styles.content} />
    </div>
  );
};



export const getStaticPaths:GetStaticPaths = async () => {
  const { data: articleData } = await axios.post(`${LOCALDOMAIN}/api/articleIntro`, {
    pageNo: 1,
    pageSize: 100,
  });
  const paths =  articleData.list.map((item: IArticleIntro) => ({
    params: { id: item.articleId },
  }))

  //{ fallback: false } means other routes should 404.
  return {paths,fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;
  const { data } = await axios.get(`${LOCALDOMAIN}/api/articleInfo`, {
    params: { id },
  });

  console.log('data', data)
  return {
    props:data
  };
}

export default Article;
