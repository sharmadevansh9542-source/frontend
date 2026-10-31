const path = require('node:path');

const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
