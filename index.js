const http = require('http');
const { config } = require('dotenv')
config()

const { sendMessage } = require('./telegram')

const PORT = process.env.PORT || 9999
const BOT_TOKEN = process.env.BOT_TOKEN
if (!BOT_TOKEN) {
  throw new Error(`Provide BOT_TOKEN env. Got:`, BOT_TOKEN)
}

const SITE_URL = process.env.SITE_URL
if (!SITE_URL) {
  throw new Error(`Provide BOT_TOKEN env. Got:`, SITE_URL)
}

const CHAT_ID = process.env.CHAT_ID
if (!CHAT_ID) {
  throw new Error(`Provide BOT_TOKEN env. Got:`, CHAT_ID)
}

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
const requestListener = function (req, res) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Access-Control-Allow-Headers': 'origin, content-type, accept'
  };

  if (req.method === 'OPTIONS') {
    return res.writeHead(204, headers).end();
  }

  if (!req.headers['content-type']?.toLowerCase?.().includes?.('application/json')) {
    return res.writeHead(400, headers).end('Use application/json content-type')
  }

  if (req.method !== 'POST') {
    return res.writeHead(405, headers).end('Use POST request')
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  req.on('end', async () => {
    let payload = {}
    try {
      /** @type {import('./telegram').ContactFormInput} */
      payload = JSON.parse(body)
    } catch (error) {
      return res.writeHead(400, headers).end('Invalid or empty request body!')
    }
    console.log(new Date(), 'New contact form filled:', JSON.stringify(payload, null, 2))
    const fields = [['name', payload.name], ['email', payload.email], ['message', payload.message]]
    if (![payload.name, payload.email, payload.message].every(f => f?.trim?.().length)) {
      let error = `Missing required fields: ${fields.filter(([k, v]) => !v?.trim?.().length).map(p => p[0])}`

      return res.writeHead(400, headers).end(error)
    }

    try {
      await sendMessage(payload, {
        botToken: BOT_TOKEN,
        chatId: CHAT_ID,
        fromSiteUrl: SITE_URL
      })
    } catch (error) {
      console.error(new Date(), error)
      return res.writeHead(500, headers).end('Internal server error')
    }

    res.writeHead(201, headers).end('Success')
  })
}

const server = http.createServer(requestListener);
server.listen(PORT);

console.log(new Date(), `Application for ${SITE_URL} started at port:`, PORT)