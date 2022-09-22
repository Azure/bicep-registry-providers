// definitions based on https://github.com/Azure/bicep-extensibility/blob/a5423dc2225b8e555a1b9c823198e67df898f8c3/src/Azure.Deployments.Extensibility.Core/Models.cs
export interface ExtensibleImport<TConfig extends object> {
  provider: string;
  version: string;
  config: TConfig;
}

export interface ExtensibleResource<TProperties extends object> {
  type: string;
  properties: TProperties;
}

export interface ExtensibilityError {
  code: string;
  target: string;
  message: string;
}

export interface ExtensibilityOperationRequest<
  TConfig extends object,
  TProperties extends object
> {
  import: ExtensibleImport<TConfig>;
  resource: ExtensibleResource<TProperties>;
}

export interface ExtensibilityOperationSuccessResponse<
  TProperties extends object
> {
  resource: ExtensibleResource<TProperties>;
}

export interface ExtensibilityOperationErrorResponse {
  errors: ExtensibilityError[];
}

export type ExtensibilityOperationResponse<
  TProperties extends object = object
> =
  | ExtensibilityOperationSuccessResponse<TProperties>
  | ExtensibilityOperationErrorResponse;

export interface GitHubConfig {
  accessToken: string;
}

export type GitHubOperationRequest<TProperties extends object> =
  ExtensibilityOperationRequest<GitHubConfig, TProperties>;

export interface RepositoryProperties {
  name: string;
  org?: string;
  [key: string]: unknown;
}

export type RepositoryOperationRequest =
  GitHubOperationRequest<RepositoryProperties>;

export interface RepositoryCollaboratorProperties {
  repo: string;
  username: string;
  owner?: string;
  permission?: string;
  [key: string]: unknown;
}

export type RepositoryCollaboratorRequest =
  GitHubOperationRequest<RepositoryCollaboratorProperties>;

export function isRepositoryOperationRequest(
  body: any
): body is RepositoryOperationRequest {
  if (
    body.resource &&
    body.resource.type &&
    typeof body.resource.type === "string" &&
    body.resource.type.startsWith("repositories@")
  ) {
    return true;
  }

  return false;
}

export function isRepositoryCollaboratorOperationRequest(
  body: any
): body is RepositoryCollaboratorRequest {
  if (
    body.resource &&
    body.resource.type &&
    typeof body.resource.type === "string" &&
    body.resource.type.startsWith("repositories/collaborators@")
  ) {
    return true;
  }

  return false;
}