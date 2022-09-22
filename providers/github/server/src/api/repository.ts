import { Octokit } from "@octokit/rest";
import { RepositoryProperties } from "../models";
import { GitHubResource } from "./githubResource";

export class Repository extends GitHubResource {
  constructor(accessToken: string) {
    super(accessToken);
  }

  async get(name: string, owner?: string) {
    if (!owner) {
      owner = await this.getAuthenticatedUserLogin();
    }

    try {
      const { data: properties } = await this.oktokit.repos.get({
        owner,
        repo: name,
      });
      return properties;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async createOrUpdate(properties: RepositoryProperties) {
    const { org, name, ...optionalProperties } = properties;
    const existingRepository = await this.get(properties.name, org);

    if (existingRepository) {
      let owner = org;

      if (!owner) {
        owner = await this.getAuthenticatedUserLogin();
      }

      const { data: updatedRepositoryProperties } = await this.oktokit.repos.update({
        owner,
        repo: name,
        ...optionalProperties,
      });

      return updatedRepositoryProperties;
    }

    if (org) {
      const { data: newOrgRepositoryProperties } = await this.oktokit.repos.createInOrg({
        org,
        name,
        ...optionalProperties,
      });

      return newOrgRepositoryProperties;
    }

    const { data: newUserRepositoryProperties } =
      await this.oktokit.repos.createForAuthenticatedUser({
        name,
        ...optionalProperties,
      });

    return newUserRepositoryProperties;
  }
}
