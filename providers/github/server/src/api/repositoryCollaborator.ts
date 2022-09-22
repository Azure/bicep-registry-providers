import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";
import { RepositoryCollaboratorProperties } from "../models";
import { GitHubResource } from "./githubResource";

export class RepositoryCollaborator extends GitHubResource {
  constructor(accessToken: string) {
    super(accessToken);
  }

  async get(
    repo: string,
    username: string,
    owner?: string,
  ): Promise<RepositoryCollaboratorProperties | undefined> {
    try {
      if (!owner) {
        owner = await this.getAuthenticatedUserLogin();
      }

      await this.oktokit.repos.checkCollaborator({ owner, repo, username });
    } catch (error) {
      if (error instanceof RequestError && error.status === 404) {
        return undefined;
      }

      throw error;
    }

    const { data: permissionProperties } =
      await this.oktokit.repos.getCollaboratorPermissionLevel({
        owner,
        repo,
        username,
      });

    return {
      owner,
      repo,
      username,
      ...permissionProperties,
    };
  }

  async createOrUpdate(
    properties: RepositoryCollaboratorProperties
  ): Promise<RepositoryCollaboratorProperties> {
    const owner = properties.owner ?? await this.getAuthenticatedUserLogin();
    const { repo, username, permission } = properties;

    await this.oktokit.repos.addCollaborator({
      owner,
      repo,
      username,
      permission,
    });
    
    const updatedProperties = await this.get(owner, repo, username);
      
    return {
      owner,
      repo,
      username,
      permission,
      ...updatedProperties,
    };
  }
}
