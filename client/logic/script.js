import OpenAI from "openai";


const openai= new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });


var list_messages=[]
/*new version Kushas*/
var first_message= ""
/*new version Kushas*/
var index= 0
var readability = localStorage.getItem("readability")
var special_need = localStorage.getItem("special_need")
const chatContainer = document.querySelector('#chat_container')
const btn = document.getElementById("submit_button")
const leftarrow = document.getElementById("left_arrow")
const rightarrow = document.getElementById("right_arrow")
const prompt = document.getElementById("prompt")
let output = document.getElementById("output");

var loading = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Loader</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
        }

        .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 2s linear infinite;
            transition: border-top-color 0.5s ease-in-out;
        }

        .loader:hover {
            border-top-color: #e74c3c;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loader"></div>
</body>
</html>
`




window.onload = async function(){
    
    var response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": `You are an helpful coding assistant. Given a text, perform the following tasks. Let's start by rewriting the text and reducing the readability level to grade ${readability} according to the Flesch-Kincaid Grade Level. It also adapts the text to a reader with this disability: ${special_need}. Keep the division into four paragraphs and a length of approximately 450 words.Then, the output must be in html format only. The text must appear as if it were in a Word document. Therefore, also include a <style> tag. The output should always begins with '<!DOCTYPE html>' and ends up with '</html>'.`
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": localStorage.getItem("inputValue")
              }
            ]
          }
        ],
        temperature: 1,
        max_tokens: 900,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      response=response.choices[0].message.content
      /*new version Kushas */
      first_message=response
      //output.contentDocument.body.innerHTML = response
      /*new version Kushas*/
      list_messages.push(response)
      console.log(readability)
      //console.log(`You are an helpful coding assistant. Given a text, perform the following tasks. Let's start by rewriting the text and reducing the readability level to grade ${readability} according to the Flesch-Kincaid Grade Level. It also adapts the text to a reader with this disability: ${special_need}. Keep the division into four paragraphs and a length of approximately 450 words.Then, the output must be in html format only. The text must appear as if it were in a Word document. Therefore, also include a <style> tag. The output should always begins with '<!DOCTYPE html>' and ends up with '</html>'.`)
      /*new version Kushas */
      var response_first = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": "You are an helpful formatting and design assistant. Your role is to  explain the choices in design and format in the new version of text, considering the user's request. "
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `Here the original text: ${localStorage.getItem("inputValue")}. \n\n Here the re-generated text that was formatted too: ${first_message}\n\n Here the desired readability: ${readability} and special need: ${special_need} \n\nExplain the differences and why the modified version is better for the user's request in terms of format and readability..`
              }
            ]
          }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      response_first=response_first.choices[0].message.content
      chatContainer.innerHTML += `
      <div class="bg-secondary text-secondary-foreground p-2 rounded mb-2">${response_first}</div>`
      output.contentDocument.body.innerHTML = response
      /*new version Kushas */
    
};

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

document.getElementById('downloadButton').addEventListener('click', function() {
    // Get the iframe content
    var iframe = document.getElementById('output');
    var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    var content = iframeDocument.documentElement.outerHTML;
    
    // Create a Blob from the content
    var blob = new Blob([content], { type: 'text/html' });
    var url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    var a = document.createElement('a');
    a.href = url;
    a.download = 'iframe-content.html'; // Set the desired file name
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

btn.onclick = async function() {
    chatContainer.innerHTML += `
    <div id="second-message" class="bg-border text-secondary-foreground p-2 rounded mb-2">${prompt.value}</div>`
    console.log(output.contentDocument.body.innerHTML)
    var text= prompt.value
    prompt.value=""
    var previous_content= output.contentDocument.body.innerHTML
    output.contentDocument.body.innerHTML=loading
    var response1 = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages:[
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": " You are an helpful coding assistant."
                    }
                ]
        },{
            "role": "user",
            "content": [
                {
                    "type": "text",
                    /*new version Kushas */
                    "text": `Given this html file: ${previous_content}\n\nAnd user request: ${text}\n\n${document.querySelector('textarea').value}`
                    /*new version Kushas */
                  }
            ]
        }],
        temperature: 1,
        max_tokens: 900,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    response1=response1.choices[0].message.content
    output.contentDocument.body.innerHTML = response1
    list_messages.push(response1)
    index += 1
    console.log(response1)
    var response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": "You are an helpful formatting and design assistant. Your role is to compare two documents and evaluate and explain the differences in design and format between the two versions, considering the user's request. "
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `Here the user's request: ${text}. \n\n Here the starting document: ${previous_content}\n\n Here the modified document: ${response1}\n\nExplain the differences and why the modified version is better for the user's request.`
              }
            ]
          }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      response=response.choices[0].message.content
      chatContainer.innerHTML += `
      <div class="bg-secondary text-secondary-foreground p-2 rounded mb-2">${response}</div>`
}

leftarrow.onclick = function() {
    if (index > 0) {
        index = index -1
        output.contentDocument.body.innerHTML = list_messages[index]
    } 
}
rightarrow.onclick = function(){
    if (index < list_messages.length) {
        index +=1
        output.contentDocument.body.innerHTML = list_messages[index]
    }
}
output.contentDocument.body.innerHTML = loading

