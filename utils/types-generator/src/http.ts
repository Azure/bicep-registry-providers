// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ObjectTypePropertyFlags, ObjectType, ResourceFlags, ResourceType, ScopeType, StringLiteralType, TypeFactory, UnionType } from 'bicep-types';
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
    uri: { Type: stringType, Flags: ObjectTypePropertyFlags.Required, Description: 'The HTTP request URI to submit a GET request to.' },
    format: { Type: formatType, Flags: ObjectTypePropertyFlags.None, Description: 'How to deserialize the response body.' },
    method: { Type: stringType, Flags: ObjectTypePropertyFlags.None, Description: 'The HTTP method to submit request to the given URI.' },
    statusCode: { Type: intType, Flags: ObjectTypePropertyFlags.ReadOnly, Description: 'The status code of the HTTP request.' },
    body: { Type: anyType, Flags: ObjectTypePropertyFlags.ReadOnly, Description: 'The parsed request bodyz.' },
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

  const typeSettings = {
    Name: 'ThirdPartyProvider',
    Version: '1.0.0',
    IsSingleton: false,
  }
  const index = buildIndex(typeFiles, logFunc, typeSettings);

  return {
    index,
    typeFiles,
  };
}