import { default as DiamondHand } from './pages/Diamond';

// actions:
//export { default as calculateDashboard } from './actions/calculateDashboard';

// components:
//export { default as DashboardList } from './components/DashboardList';

// pages:
export const pages = [
  {
    path: '/diamondHand',
    icon: 'diamondHand',
    order: 6,
    title: 'Diamond Hand',
    visible: true,
    component: DiamondHand
  }
];

export { default as diamond } from './reducers/diamond';
// reducers:
//export { default as prices } from './reducers/prices';

// thunks:
//export { default as getUSDPrices } from './thunks/getUSDPrices';
//export { default as getGasPrices } from './thunks/getGasPrices';
