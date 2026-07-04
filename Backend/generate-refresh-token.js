const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const clientID = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectURI = 'https://developers.google.com/oauthplayground'; 

if (!clientID || !clientSecret) {
  console.error("Error: Please ensure OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET are set in your .env file.");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  clientID,
  clientSecret,
  redirectURI
);

const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send'
];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent' 
});

console.log('===================================================');
console.log('1. Open the following URL in your browser:');
console.log('---------------------------------------------------');
console.log(url);
console.log('===================================================');
console.log('\n2. Authorize the application using your Google account.');
console.log('3. You will be redirected to the OAuth Playground.');
console.log('4. Copy the entire URL from the browser address bar (it will contain "code=...") and paste it below.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nPaste the redirect URL (or authorization code) here: ', async (input) => {
  let code = input.trim();
  if (code.includes('code=')) {
    try {
      // If they pasted the whole URL, try parsing it
      if (code.startsWith('http')) {
        const urlObj = new URL(code);
        code = urlObj.searchParams.get('code');
      } else {
        // If they pasted just the query parameters, e.g. ?code=xxx
        const params = new URLSearchParams(code.substring(code.indexOf('?')));
        code = params.get('code') || code;
      }
    } catch (e) {
      // fallback if parsing fails
    }
  }
  
  if (!code) {
    console.error('Could not extract authorization code. Please try again.');
    rl.close();
    process.exit(1);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n===================================================');
    console.log('SUCCESS! Here is your OAUTH_REFRESH_TOKEN:');
    console.log('---------------------------------------------------');
    console.log(tokens.refresh_token);
    console.log('===================================================');
    console.log('\nUpdate your .env file with this token, and restart your server.');
  } catch (error) {
    console.error('\nError exchanging code:', error.message || error);
    console.log('Please ensure that the Redirect URI "https://developers.google.com/oauthplayground" is added to your OAuth client in Google Cloud Console.');
  }
  rl.close();
});
