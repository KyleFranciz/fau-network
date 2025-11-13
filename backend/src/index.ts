//imports
import { app } from "./app";
import dotenv from "dotenv";

// help bring in env variables
dotenv.config();

const PORT = Number(process.env.PORT || 8000);

// start the actual server
// listen - has the port run on 5000 and then the 0.0.0.0 listens to everything so that docker can connect and run
app.listen(PORT, "0.0.0.0", () => {
  console.log("This server is running on the correct port rn:" + PORT);
});
