import { default as PageNotFound } from './pages/PageNotFound';

// pages:
export const pages = [
  {
    path: '*',
    icon: null,
    order: 999,
    title: '404_TITLE',
    visible: false,
    component: PageNotFound
  }
];
