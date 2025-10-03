import app from "./app";
import getEnvVars from "./lib/getEnvVars";
import connectToMongoDB from "./lib/mongo/connectToMongoDB";

(async () => {
  try {
    await connectToMongoDB().then(() => {
      const port = getEnvVars().port;
      app.listen(port, () => {
        console.log(`API is running on port: ${port}`);
      });
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
})();
