// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { BuiltInTypeKind, ObjectProperty, ObjectPropertyFlags, ObjectType, ResourceFlags, ResourceType, ScopeType, StringLiteralType, TypeFactory, UnionType } from 'bicep-types/lib/src/types';
import { buildIndex } from 'bicep-types/lib/src/indexer';

function generateHttpV1Types() {
  const factory = new TypeFactory();

  const formatType = factory.addType(new UnionType([
    factory.addType(new StringLiteralType("raw")),
    factory.addType(new StringLiteralType("json")),
  ]));

  const props = factory.addType(new ObjectType('request@v1', {
    uri: new ObjectProperty(factory.builtInTypes[BuiltInTypeKind.String], ObjectPropertyFlags.Required, 'The HTTP request URI to submit a GET request to.'),
    format: new ObjectProperty(formatType, ObjectPropertyFlags.None, 'How to deserialize the response body.'),
    method: new ObjectProperty(factory.builtInTypes[BuiltInTypeKind.String], ObjectPropertyFlags.None, 'The HTTP method to submit request to the given URI.'),
    statusCode: new ObjectProperty(factory.builtInTypes[BuiltInTypeKind.Int], ObjectPropertyFlags.ReadOnly, 'The status code of the HTTP request.'),
    body: new ObjectProperty(factory.builtInTypes[BuiltInTypeKind.Any], ObjectPropertyFlags.ReadOnly, 'The parsed request bodyz.'),
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