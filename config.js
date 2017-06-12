exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/priorities-app';
exports.TEST_DATABASE_URL = (
  process.env.TEST_DATABASE_URL ||
  'mongodb://localhost/test-priorities-app');
exports.PORT = process.env.PORT || 8080;