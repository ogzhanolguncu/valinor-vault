import net from "net";
import { deserialize } from "./resp-v2/deserialize";
import { handleCommand } from "./store/handle-commands";
import { restoreFromBackup } from "./store/save";

const PORT = 6379;

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    const command = deserialize(data.toString());
    const response = handleCommand(command);
    socket.write(response);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

restoreFromBackup();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
