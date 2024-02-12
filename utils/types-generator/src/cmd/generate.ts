// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import yargs from 'yargs';
import path from 'path';
import { series } from 'async';
import { mkdir, writeFile } from 'fs/promises';
import { writeJson, writeIndexJson } from 'bicep-types';
import { writeMarkdown, writeIndexMarkdown } from 'bicep-types';
import { generateHttpTypes } from '../http';

const argsConfig = yargs
  .strict()
  .option('out-basedir', { type: 'string', required: true, desc: 'Output base path for generated files' })
  .option('provider', { type: 'string', required: true, desc: 'Pick a provider to generate types for', choices: ['http'] })

executeSynchronous(async () => {
  const args = await argsConfig.parseAsync();
  const outBasedir = args['out-basedir'];
  const provider = args['provider'];

  const { index, typeFiles } = generateTypes(provider, console.log);

  await forceWriteFile(`${outBasedir}/index.json`, writeIndexJson(index));
  await forceWriteFile(`${outBasedir}/index.md`, writeIndexMarkdown(index));
  for (const { types, apiVersion, relativePath } of typeFiles) {
    await forceWriteFile(`${outBasedir}/${relativePath}`, writeJson(types));
    await forceWriteFile(`${outBasedir}/${relativePath.substring(0, relativePath.lastIndexOf('.'))}.md`, writeMarkdown(types)); 
  }
});

function generateTypes(provider: string, logFunc: (val: string) => void) {
  switch (provider) {
    case 'http':
      return generateHttpTypes(logFunc);
    default:
      throw `Provider '${provider}' has not been implemented!`;
  }
}

function executeSynchronous<T>(asyncFunc: () => Promise<T>) {
  series(
    [asyncFunc],
    (error) => {
      if (error) {
        throw error;
      }
    });
}

async function forceWriteFile(filePath: string, contents: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, 'utf-8');
}