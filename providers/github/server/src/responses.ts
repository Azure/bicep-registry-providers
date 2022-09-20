import {
  ExtensibilityError,
  ExtensibilityOperationErrorResponse,
  ExtensibilityOperationSuccessResponse,
  ExtensibleResource,
} from "./models";

export function createSuccessResponse<TProperties extends object>(
  resource: ExtensibleResource<TProperties>
): ExtensibilityOperationSuccessResponse<TProperties> {
  return { resource };
}

export function createErrorResponse(
  ...errors: ExtensibilityError[]
): ExtensibilityOperationErrorResponse {
  return { errors };
}

export const unsupportedResourceTypeResponse = createErrorResponse({
  code: "UnsupportedResourceType",
  target: "/resource/type",
  message: "The resource type is not supported."
})