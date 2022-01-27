import { default as DiamondHand } from './pages/Diamond';

export const pages = [
  {
    path: '/legendhand',
    icon: 'legendhand',
    order: 6,
    title: 'Legend Hand',
    visible: true,
    component: DiamondHand
  }
];

export { default as diamond } from './reducers/diamond';

