import { pages as pageNotFound } from './404';
import { pages as crosschain } from './crosschain';
import { pages as dashboard } from './dashboard';
import { pages as vaults } from './vaults';
import { pages as stake } from './stake';
import { pages as vote } from './vote';
import { pages as home } from './home';

export const pages = [
  ...pageNotFound,
  ...crosschain,
  ...dashboard,
  ...vaults,
  ...stake,
  ...vote,
  ...home
].sort((a, b) => a.order - b.order);
