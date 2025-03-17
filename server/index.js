const app = require("./app");
const http = require("http");
const config = require("./config/config");
const logger = require("./utils/logger");
const approveOldMatches = require("./utils/matchApprovalWorker");

// Create a server using the app from the app.js file
const server = http.createServer(app);

// Start the match approval worker
approveOldMatches();

// const PORT = config.PORT || 4000;
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
