import path from 'path';
import { fileURLToPath } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadSchemaVersion(version) {
  const basePath = path.join(__dirname, version);
  const typeDefs = loadFilesSync(path.join(basePath, 'types'), {
    extensions: ['graphql'],
  });
  const resolvers = loadFilesSync(path.join(basePath, 'resolvers'), {
    extensions: ['js'],
  });

  return {
    typeDefs: mergeTypeDefs(typeDefs),
    resolvers: mergeResolvers(resolvers),
  };
}

export const schemas = {
  v1: loadSchemaVersion('v1'),
};
