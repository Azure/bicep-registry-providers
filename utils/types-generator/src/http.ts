// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { BuiltInTypeKind, ObjectProperty, ObjectPropertyFlags, ObjectType, ResourceFlags, ResourceType, ScopeType, TypeFactory } from 'bicep-types/lib/src/types';
import { buildIndex } from 'bicep-types/lib/src/indexer';

function generateHttpV1Types() {
  const factory = new TypeFactory();

  const props = factory.addType(new ObjectType('request@v1', {
    requestUri: new ObjectProperty(factory.builtInTypes[BuiltInTypeKind.String], ObjectPropertyFlags.None, 'The HTTP request URI to submit a GET request to.'),
  }));
  factory.addType(new ResourceType('request@v1', ScopeType.Unknown, undefined, props, ResourceFlags.None));
  
  return factory.types;
}

export function generateHttpTypes(logFunc: (val: string) => void) {
  const typeFiles = [
    {
      apiVersion: 'v1',
      relativePath: 'v1/types.json',
      types: generateHttpV1Types(),
    }
  ];
  const index = buildIndex(typeFiles, logFunc);

  return {
    index,
    typeFiles,
  };
}