import { default as Vaults } from './pages/Vaults';

// components:
export { default as VaultForm } from './components/VaultForm';
export { default as VaultAdmin } from './components/VaultAdmin';
export { default as VaultStats } from './components/VaultStats';
export { default as VaultHeader } from './components/VaultHeader';
export { default as VaultFilter } from './components/VaultFilter';
export { default as VaultBasedOn } from './components/VaultBasedOn';
export { default as VaultStrategy } from './components/VaultStrategy';
export { default as VaultDescription } from './components/VaultDescription';

// pages:
export const pages = [
  {
    path: '/vaults',
    icon: 'vaults',
    order: 2,
    title: 'VAULTS_TITLE',
    visible: true,
    component: Vaults,
    displayOnHome: true,

  }
];

// helpers:
export { default as getAPY } from './helpers/getAPY';

// reducers:
export { default as vaults } from './reducers/vaults';

// thunks:
export { default as getVaultBalances } from './thunks/getVaultBalances';
export { default as setHideZeroValue } from './thunks/setHideZeroValue';
export { default as withdrawAllVault } from './thunks/withdrawAllVault';
export { default as depositAllVault } from './thunks/depositAllVault';
export { default as setSearchValue } from './thunks/setSearchValue';
export { default as checkApproval } from './thunks/checkApproval';
export { default as setGovernance } from './thunks/setGovernance';
export { default as setController } from './thunks/setController';
export { default as withdrawVault } from './thunks/withdrawVault';
export { default as depositVault } from './thunks/depositVault';
export { default as unpauseVault } from './thunks/unpauseVault';
export { default as pauseVault } from './thunks/pauseVault';
export { default as setBasedOn } from './thunks/setBasedOn';
export { default as earnVault } from './thunks/earnVault';
export { default as setMin } from './thunks/setMin';
