require("dotenv").config();
import pino from "pino";
import { createPinoBrowserSend, createWriteStream } from "pino-logflare";

// create pino-logflare stream
const stream = createWriteStream({
  apiKey: process.env.LOGFLARE_API,
  sourceToken: process.env.LF_SOURCE_ID,
});

// create pino-logflare browser stream
const send = createPinoBrowserSend({
  apiKey: process.env.LOGFLARE_API,
  sourceToken: process.env.LF_SOURCE_ID,
});

// create pino loggger
const logger = pino(
  {
    browser: {
      transmit: {
        send: send,
      },
    },
  },
  stream
);

exports.logger = logger;

/*
// log some events
logger.info("Informational message");
logger.error(new Error("things got bad"), "err.response or something");

const child = logger.child({ property: "value" });
child.info("hello child!");
*/
