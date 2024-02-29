// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ObjectTypePropertyFlags, ResourceFlags, ScopeType, TypeFactory, BicepType, TypeReference, TypeSettings, CrossFileTypeReference } from 'bicep-types';
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

//Should fallback type even be in the resources array? 
function generateLocations(): [TypeReference, TypeReference, BicepType[]] {
  const factory = new TypeFactory();

  const configFactory = new TypeFactory();
  const configLocation = configFactory.addObjectType('config', {
    configProp: {
      type: factory.addStringType(),
      flags: ObjectTypePropertyFlags.Required,
      description: 'Config property',
    },
  });

  const fallbackTypeLocation = configFactory.addResourceType('fallback', ScopeType.Unknown, undefined, configFactory.addObjectType('fallback body', {
    bodyProp: {
      type: factory.addStringType(),
      flags: ObjectTypePropertyFlags.Required,
      description: 'Body property',
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

  const typeSettings: TypeSettings = {
    name: 'ThirdPartyProvider',
    version: '1.0.0',
    isSingleton: false,
    configurationType: new CrossFileTypeReference('types.json', configLocation.index),
  }

  const fallbackResourceType = new CrossFileTypeReference('types.json', fallbackTypeLocation.index);

  const index = buildIndex(typeFiles, logFunc, typeSettings, fallbackResourceType);

  return {
    index,
    typeFiles,
    rootTypeFiles,
  };
}