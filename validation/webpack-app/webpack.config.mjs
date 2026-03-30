import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/main.js',
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  optimization: {
    // Use real chunk splitting for analysis
    splitChunks: {
      chunks: 'all',
    },
    usedExports: true,
    sideEffects: true,
  },
  stats: {
    modules: true,
    modulesSpace: 100,
  },
};
