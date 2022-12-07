/* eslint-disable no-param-reassign */
import { Octokit } from '@octokit/core';
// import { createPullRequest } from 'octokit-plugin-create-pull-request';

import type { Asset, GithubSync } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const MyOctokit = Octokit.plugin(createPullRequest);

class Github {
  config: GithubSync;

  assets: Array<Asset>;

  constructor(config: GithubSync, assets: Array<Asset>) {
    this.config = config;
    this.assets = assets;
  }

  async pullRequest() {
    let octokit;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      octokit = new Octokit({
        auth: this.config.githubPersonalToken,
      });
    } catch (e) {
      console.log(e);
    }

    // octokit?.createPullRequest({
    //   owner: this.config.githubOwner,
    //   repo: this.config.gitRepo,
    //   title: 'test',
    //   body: 'autogenerated',
    //   forceFork: true,
    //   createWhenEmpty: false,
    //   head: this.config.gitBranch,
    //   changes: [
    //     {
    //       files: this.assets.reduce((accum: {[key: string]: any}, cur) => {
    //         accum[cur.path] = cur.data;
    //         return accum;
    //       }, {}),
    //       commit: 'automated',
    //     },
    //   ],
    // });
  }
}

export default Github;
