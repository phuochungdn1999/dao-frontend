import { default as Dashboard } from './pages/Dashboard';

// actions:
export { default as calculateDashboard } from './actions/calculateDashboard';

// components:
export { default as DashboardList } from './components/DashboardList';

// pages:
export const pages = [
  {
    path: '/dashboard',
    icon: 'dashboard',
    order: 1,
    title: 'DASHBOARD_TITLE',
    visible: true,
    component: Dashboard
  }
];

// reducers:
export { default as prices } from './reducers/prices';

// thunks:
export { default as getUSDPrices } from './thunks/getUSDPrices';
export { default as getGasPrices } from './thunks/getGasPrices';
