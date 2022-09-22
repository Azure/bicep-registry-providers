#!/bin/bash

pushd $(dirname -- "$0")/../utils/types-generator
npm ci
rm -Rf ../../providers/http/types
npm run generate -- --out-basedir ../../providers/http/types --provider http
popd