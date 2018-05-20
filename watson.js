// Example 1: sets up service wrapper, sends initial message, and
// receives response.

var prompt = require('prompt-sync')();
var AssistantV1 = require('watson-developer-cloud/assistant/v1');

// Set up Assistant service wrapper.
var service = new AssistantV1({
  username: 'f99748d4-60b4-49be-bbbe-847615a53e8a', // replace with service username
  password: 'QxRgakXoUm7o', // replace with service password
  version: '2018-02-16'
});

var workspace_id = '9077b9ae-fa8b-4c8f-a3be-dad75ce37af2'; // replace with workspace ID

// Start conversation with empty message.
service.message({
  workspace_id: workspace_id
}, processResponse);

// Process the service response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  let endConversation = false
  // If an intent was detected, log it out to the console.
  if (response.intents.length > 0) {
    console.log('Detected intent: #' + response.intents[0].intent);
    if (response.intents[0].intent === 'Stand') endConversation = true
  }

  console.log(endConversation)

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
    console.log(response.output.text[0]);
  }

  if (!endConversation) {
    // Prompt for the next round of input.
    var newMessageFromUser = prompt('>> ');
    service.message({
      workspace_id: workspace_id,
      input: { text: newMessageFromUser },
      contest: response.context
    }, processResponse)
  }
}
