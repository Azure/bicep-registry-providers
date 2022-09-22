import { Octokit } from "@octokit/rest";

export abstract class GitHubResource {
  protected readonly oktokit: Octokit;

  constructor(accessToken: string) {
    this.oktokit = new Octokit({ auth: accessToken });
  }
  
  
  protected async getAuthenticatedUserLogin() {
    const { data: user } = await this.oktokit.users.getAuthenticated();
    return user.login;
  }
}