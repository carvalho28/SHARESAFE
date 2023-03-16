import buildServer from "./server";
import dotenv from "dotenv";
dotenv.config();

const port = parseInt(process.env.PORT || "3000");
const server = buildServer();

server.listen({ port: port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
