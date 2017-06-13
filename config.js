exports.DATABASE_URL = process.env.MONGODB_URI ||
                      'mongodb://localhost/priorities-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                            'mongodb://localhost/test-priorities-app';
exports.PORT = process.env.PORT || 8080;