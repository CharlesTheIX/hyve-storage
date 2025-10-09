import fs from "fs";
import path from "path";

const logDir: string = path.join(process.cwd(), ".logs");
const logFile: string = path.join(logDir, "error.log");

const logError = (data: ApiResponse): void => {
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  if (!fs.existsSync(logFile)) fs.openSync(logFile, "a");

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ERROR: ${data.status} | ${data.message}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error("Failed to write to error log:", err);
  });
};

export default logError;
