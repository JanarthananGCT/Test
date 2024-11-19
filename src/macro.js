import ForgeUI, { render, Fragment, Text, IssuePanel, TextField, Form, useState, TextArea } from '@forge/ui';

const COMMANDS = [
  { command: '/connect', description: 'Connect to SurveySparrow' },
  { command: '/disconnect', description: 'Disconnect from SurveySparrow' },
  { command: '/help', description: 'Get a list of available commands' }
];

const App = () => {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("Type /connect, /disconnect, or /help.");
  const [recommendations, setRecommendations] = useState([]);
  
  const handleCommand = (data) => {
    const command = data.command.trim().toLowerCase();

    if (command === "/connect") {
      setConnected(true);
      setMessage("Connected successfully!");
    } else if (command === "/disconnect") {
      setConnected(false);
      setMessage("Disconnected successfully!");
    } else if (command === "/help") {
      setMessage("Available commands: /connect, /disconnect, /help");
    } else {
      setMessage("Unknown command. Try /help for a list of commands.");
    }
  };

  const handleInputChange = (data) => {
    const input = data.command.trim().toLowerCase();
    // Show recommendations based on the input
    const filteredCommands = COMMANDS.filter((cmd) =>
      cmd.command.startsWith(input)
    );
    setRecommendations(filteredCommands);
  };

  return (
    <Fragment>
      <Text>Welcome to the SurveySparrow Macro!</Text>
      <Text>Status: {connected ? "Connected" : "Disconnected"}</Text>
      
      <Form onSubmit={handleCommand} onChange={handleInputChange}>
        <TextField
          name="command"
          placeholder="Type /connect, /disconnect, or /help"
          
        />
      </Form>

      {/* Display command recommendations */}
      {recommendations.length > 0 && (
        <Fragment>
          <Text>Suggestions:</Text>
          {recommendations.map((rec) => (
            <Text key={rec.command}>
              <strong>{rec.command}</strong>: {rec.description}
            </Text>
          ))}
        </Fragment>
      )}
      
      <Text>{message}</Text>
    </Fragment>
  );
};

export const handler = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);