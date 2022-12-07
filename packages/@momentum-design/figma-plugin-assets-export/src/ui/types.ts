import { CONSTANTS } from './constants';

export type AssetsType = typeof CONSTANTS.ASSET_TYPES[keyof typeof CONSTANTS.ASSET_TYPES];

export type TabType = 'export' | 'tools' | 'settings';

export type GithubSync = {
  githubOwner: string;
  githubPersonalToken: string;
  gitBranch: string;
  gitRepo: string;
};
