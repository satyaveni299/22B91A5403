const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'logs.txt');

const logger = (req, res, next) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
  fs.appendFileSync(logFile, logEntry);
  next();
};

module.exports = logger;
