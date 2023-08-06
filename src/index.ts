import net from "net";
import { deserialize } from "./resp/deserialize";
import { serialize } from "./resp/serialize";

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    const command = deserialize(data.toString());

    handleCommand(socket, command);
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

const PORT = 6379;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function handleCommand(
  client: any,
  command: string | number | any[]
) {
  if (!Array.isArray(command)) {
    client.write(
      serialize(
        "-ERR unknown command or wrong number of arguments\r\n"
      )
    );
    return;
  }

  const [cmd, ...args] = command;
  switch (cmd.toLowerCase()) {
    case "ping":
      client.write(serialize("+pong"));
      break;
    case "echo":
      if (args.length !== 1) {
        client.write(
          serialize(
            "-ERR wrong number of arguments for 'echo' command"
          )
        );
      } else {
        client.write(serialize(args[0]));
      }
      break;
    case "command":
      client.write(serialize(null));
      break;
    default:
      client.write(serialize(`-ERR unknown command '${cmd}'`));
      break;
  }
}
