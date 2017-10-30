const fs = require('fs');
const path = require('path');

module.exports = function instrument(files, nyc) {
  const instrumenter = nyc.instrumenter();

  return async (ctx, next) => {
    await next();
    const { request, response } = ctx;
    const { url } = request;

    if (nyc.exclude.shouldInstrument(url)) {
      const filePath = path.relative(process.cwd(), url);
      const file = fs.readFileSync(filePath, 'utf-8');
      response.body = instrumenter.instrumentSync(file, filePath);
    }
  };
};