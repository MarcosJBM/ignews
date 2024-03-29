import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

import config from './slicemachine.config.json';

export const repositoryName = config.repositoryName;

const routes: prismic.ClientConfig['routes'] = [
  {
    type: 'post',
    path: '/posts',
  },
  {
    type: 'post',
    path: '/posts/:uid',
  },
];

export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
