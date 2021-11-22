# Contact form sender

This app sends contact form messages to you using your telegram bot.

# Installation

Clone this repository. Install dependencies `npm install`.

Fill `.env` as in [example](./.env.example)

# Run

`npm run start`

# Usage

Send `POST` request with `Content-Type: 'application/json'` header and JSON body with required params (`name`, `email`, `message`) of string type.

Example: `curl -X POST -H 'Content-Type: application/json' localhost:9999 -d '{ "email": "joe@beretta.xyz", "name": "Joe Beretta", "message": "Hi man!" }`

# Author

[Joe Beretta](https://t.me/joeberetta)