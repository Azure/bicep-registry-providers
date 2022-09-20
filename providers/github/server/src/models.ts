// definitions based on https://github.com/Azure/bicep-extensibility/blob/a5423dc2225b8e555a1b9c823198e67df898f8c3/src/Azure.Deployments.Extensibility.Core/Models.cs
export interface ExtensibleImport<T> {
  provider: string;
  version: string;
  config: T,
}

export interface ExtensibleResource<T> {
  type: string;
  properties: T;
}

export interface ExtensibilityError {
  code: string;
  target: string;
  message: string;
}

export interface ExtensibilityOperationRequest<TConfig, TProperties> {
  import: ExtensibleImport<TConfig>;
  resource: ExtensibleResource<TProperties>;
}

export interface GenericExtensibilityOperationRequest extends ExtensibilityOperationRequest<object, object> {}