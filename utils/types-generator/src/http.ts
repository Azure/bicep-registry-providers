// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ObjectTypePropertyFlags, ResourceFlags, ScopeType, TypeFactory } from 'bicep-types';
import { buildIndex } from 'bicep-types';

function generateHttpV1Types() {
  const factory = new TypeFactory();

  const formatType = factory.addUnionType([
    factory.addStringLiteralType("raw"),
    factory.addStringLiteralType("json"),
  ]);

  const stringType = factory.addStringType();
  const intType = factory.addIntegerType();
  const anyType = factory.addAnyType();

  const props = factory.addObjectType('request@v1', {
    uri: { type: stringType, flags: ObjectTypePropertyFlags.Required, description: 'The HTTP request URI to submit a GET request to.' },
    format: { type: formatType, flags: ObjectTypePropertyFlags.None, description: 'How to deserialize the response body.' },
    method: { type: stringType, flags: ObjectTypePropertyFlags.None, description: 'The HTTP method to submit request to the given URI.' },
    statusCode: { type: intType, flags: ObjectTypePropertyFlags.ReadOnly, description: 'The status code of the HTTP request.' },
    body: { type: anyType, flags: ObjectTypePropertyFlags.ReadOnly, description: 'The parsed request bodyz.' },
  });
  factory.addResourceType('request@v1', ScopeType.Unknown, undefined, props, ResourceFlags.None);
  
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