import express from "express";
import { Repository, RepositoryCollaborator } from "./api";
import {
  ExtensibleResource,
  isRepositoryCollaboratorOperationRequest,
  isRepositoryOperationRequest,
} from "./models";
import {
  createErrorResponse,
  createSuccessResponse,
  unsupportedResourceTypeResponse,
} from "./responses";
import {
  errorHandler,
  extensibilityContractValidator,
  runAsyncWrapper,
} from "./middleware";

function patchProperties<TProperties extends object>(
  resource: ExtensibleResource<TProperties>,
  properties: TProperties
) {
  return {
    ...resource,
    properties: {
      ...resource.properties,
      ...properties,
    },
  };
}

const port = 8080;
const host = "0.0.0.0";
const app = express();

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

app.use(express.json());

app.post(
  "/get",
  extensibilityContractValidator,
  runAsyncWrapper(async ({ body }, res) => {
    const { accessToken } = body.import.config;

    if (isRepositoryOperationRequest(body)) {
      const repository = new Repository(accessToken);
      const { name, org } = body.resource.properties;
      const properties = await repository.get(name, org);

      if (!properties) {
        return res.json(
          createErrorResponse({
            code: "RepositoryNotFound",
            target: "/resource",
            message: "The repository does not exist.",
          })
        );
      }

      return res.json(
        createSuccessResponse(patchProperties(body.resource, properties))
      );
    }

    if (isRepositoryCollaboratorOperationRequest(body)) {
      const collaborator = new RepositoryCollaborator(accessToken);
      const { repo, username, owner } = body.resource.properties;
      const properties = await collaborator.get(repo, username, owner);

      if (!properties) {
        return res.json(
          createErrorResponse({
            code: "CollaboratorNotFound",
            target: "/resource",
            message: "Could not found the collaborator in the repository.",
          })
        );
      }

      return res.json(
        createSuccessResponse(patchProperties(body.resource, properties))
      );
    }

    return res.json(unsupportedResourceTypeResponse);
  })
);

app.post(
  "/save",
  extensibilityContractValidator,
  runAsyncWrapper(async ({ body }, res) => {
    const { accessToken } = body.import.config;

    if (isRepositoryOperationRequest(body)) {
      const repository = new Repository(accessToken);
      const properties = await repository.createOrUpdate(
        body.resource.properties
      );

      return res.json(
        createSuccessResponse(patchProperties(body.resource, properties))
      );
    }

    if (isRepositoryCollaboratorOperationRequest(body)) {
      const collaborator = new RepositoryCollaborator(accessToken);
      const updatedProperties = await collaborator.createOrUpdate(
        body.resource.properties
      );

      return res.json(
        createSuccessResponse(patchProperties(body.resource, updatedProperties))
      );
    }

    return res.json(unsupportedResourceTypeResponse);
  })
);

app.post(
  "/previewSave",
  extensibilityContractValidator,
  runAsyncWrapper(async ({ body }, res) => {
    if (isRepositoryOperationRequest(body)) {
      return res.json(createSuccessResponse(body.resource));
    }

    if (isRepositoryCollaboratorOperationRequest(body)) {
      return res.json(createSuccessResponse(body.resource));
    }

    return res.json(unsupportedResourceTypeResponse);
  })
);

app.post(
  "/delete",
  extensibilityContractValidator,
  runAsyncWrapper(async ({ body }, res) => {
    throw new Error("Not implemented.");
  })
);

app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`⚡️[server]: Server is running at https://${host}:${port}`);
});