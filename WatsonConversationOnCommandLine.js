'use strict';
/* eslint-env es6*/

const watson = require('watson-developer-cloud');

/**
 * Instantiate the Watson Conversation Service
 */
const conversation = new watson.ConversationV1({
  username: process.env.CONVERSATION_USERNAME || '23d7ed88-6aab-4fe8-a775-29965294537b',
  password: process.env.CONVERSATION_PASSWORD || '0M8N2o6qZjNT',
  version_date: watson.ConversationV1.VERSION_DATE_2017_05_26
});

/**
 * Calls the conversation message api.
 * returns a promise  
 */
const message = function(text, context) {
  const payload = {
    workspace_id: process.env.WORKSPACE_ID || 'b12e7a6e-d0ea-469f-89d1-f179cc67246a',
    input: {
      text: text
    },
    context: context
  };
  return new Promise((resolve, reject) =>
    conversation.message(payload, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
};

// This example makes two successive calls to conversation service.
// Note how the context is passed:
// In the first message the context is undefined. The service starts a new conversation.
// The context returned from the first call is passed in the second request - to continue the conversation.
message('Hi', undefined)
  .then(response1 => {
    // APPLICATION-SPECIFIC CODE TO PROCESS THE DATA
    // FROM CONVERSATION SERVICE
  //  console.log(JSON.stringify(response1, null, 2), '\n--------');
    console.log(response1.output.text);
    // invoke a second call to conversation
    return message('<change this>', response1.context);// change this depending on what you want to ask.
  })
  .then(response2 => {
    //console.log(JSON.stringify(response2, null, 2), '\n--------');
    console.log(response2.output.text);
    return message('buy it', response2.context);
  }).then(response3 => {
    console.log(" 3rd converstaion:   ")
    console.log(JSON.stringify(response2, null, 2), '\n--------');
    console.log(response3.output.text);
    //console.log('Note that the two reponses should have the same context.conversation_id');
  })
  .catch(err => {
    // APPLICATION-SPECIFIC CODE TO PROCESS THE ERROR
    // FROM CONVERSATION SERVICE
    console.error(JSON.stringify(err, null, 2));
  });

