// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ObjectTypePropertyFlags, ObjectType, ResourceFlags, ResourceType, ScopeType, StringLiteralType, TypeFactory, UnionType, TypeIndexEntry, TypeFile, BicepType } from 'bicep-types';
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

//Should fallback type even be in the resources array? 
function generateLocations(): [number, number, BicepType[]] {
  const factory = new TypeFactory();

  const configFactory = new TypeFactory();
  const configLocation = configFactory.addObjectType('config', {
    configProp: {
      Type: factory.addStringType(),
      Flags: ObjectTypePropertyFlags.Required,
      Description: 'Config property',
    },
  });

  const fallbackTypeLocation = configFactory.addResourceType('fallback', ScopeType.Unknown, undefined, configFactory.addObjectType('fallback body', {
    bodyProp: {
      Type: factory.addStringType(),
      Flags: ObjectTypePropertyFlags.Required,
      Description: 'Body property',
    },
  }), ResourceFlags.None);

  // typeFiles.push({
  //   relativePath: './types.json',
  //   types: configFactory.types,
  // });

  return [configLocation, fallbackTypeLocation, configFactory.types];
}

export function generateHttpTypes(logFunc: (val: string) => void) {
  const typeFiles = [
    {
      apiVersion: 'v1',
      relativePath: 'v1/types.json',
      types: generateHttpV1Types(),
    }
  ];

  const [configLocation, fallbackTypeLocation, typeArray] = generateLocations();

  const rootTypeFiles = [
    {
      apiVersion: '1.0.0',
      relativePath: './types.json',
      types: typeArray,
    }
  ];

  const typeSettings = {
    Name: 'ThirdPartyProvider',
    Version: '1.0.0',
    IsSingleton: false,
    Configuration: {
      Index: configLocation,
      RelativePath: './types.json',
    },
  }

  const fallbackResourceType = {
    Index: fallbackTypeLocation,
    RelativePath: './types.json',
  };

  const index = buildIndex(typeFiles, logFunc, typeSettings, fallbackResourceType);

  return {
    index,
    typeFiles,
    rootTypeFiles,
  };
}