import { Octokit } from "@octokit/rest";
import express, { ErrorRequestHandler } from "express";
import { Repository } from "./api/repository";
import { ExtensibilityError, isRepositoryOperationRequest } from "./models";
import {
  createSuccessResponse,
  unsupportedResourceTypeResponse,
} from "./responses";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error: ExtensibilityError = {
    code: "UhOh",
    message: `Something unexpected happened: ${err}`,
    target: "",
  };

  res.status(400).json(error);
};

const port = 8080;
const host = "0.0.0.0";
const app = express();

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

app.use(express.json());

app.post("/Get", async ({ body }, res) => {
  if (isRepositoryOperationRequest(body)) {
    const repository = new Repository(body.import.config.accessToken);
    const { name, org } = body.resource.properties;
    const properties = await repository.get(name, org);
    
    console.log("Success");

    return res.json(createSuccessResponse({
      ...body.resource,
      properties: {
        ...body.resource.properties,
        ...properties,
      },
    }));
  }

  return res.json(unsupportedResourceTypeResponse);
});

app.post("/Save", async ({ body }, res) => {
  if (isRepositoryOperationRequest(body)) {
    const repository = new Repository(body.import.config.accessToken);
    const properties = await repository.createOrUpdate(body.resource.properties);

    return res.json(createSuccessResponse({
      ...body.resource,
      properties: {
        ...body.resource.properties,
        ...properties,
      },
    }));
  }

  return res.json(unsupportedResourceTypeResponse);
});

app.post("/PreviewSave", ({ body }, res) => {
  if (isRepositoryOperationRequest(body)) {
    return res.json(createSuccessResponse(body.resource));
  }

  return res.json(unsupportedResourceTypeResponse);
});

app.post("/Delete", (req, res) => {
  throw new Error("Not implemented.");
});

app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`⚡️[server]: Server is running at https://${host}:${port}`);
});

/* Test request body:
{
  "import": {
    "provider": "foo",
    "version": "1.0",
    "config": {}
  },
  "resource": {
    "type": "bar@v1",
    "properties": {}
  }
}
*/
