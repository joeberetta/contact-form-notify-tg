const https = require('superagent');

const TELEGRAM_URL = 'https://api.telegram.org/bot'

/**
 * @typedef {Object} ContactFormInput
 * @property {string} email sender's email
 * @property {string} name sender's full name
 * @property {string} message
 */

/**
 * Prepares telegram message output
 * @param {string} url of site from where we got message
 * @param {ContactFormInput} input 
 * @returns {string} formatted telegram message
 */
const prepareTelegramMessage = (url, input) => {
  const { name, email, message } = input
  return `New contact form message at ${url} from <b>${name.trim()}</b> (${email.trim()}):\n<i>${message.trim()}</i>`
}

/**
 * @typedef {Object} SendMessageOptions
 * @property {number | string} chatId `@channelname` or chat's id
 * @property {string} fromSiteUrl contact form site url
 * @property {string} botToken telegram bot token
 */

/**
 * Sends formatted message to given chat
 * @param {ContactFormInput} input 
 * @param {SendMessageOptions} options
 */
module.exports.sendMessage = async (input, options) => {
  const { chatId, fromSiteUrl, botToken } = options

  try {
    await https.post(`${TELEGRAM_URL}${botToken}/sendMessage`).send({
      chat_id: chatId,
      text: prepareTelegramMessage(fromSiteUrl, input),
      parse_mode: 'HTML',
    });
  } catch (error) {
    throw new Error(JSON.stringify(error.response.body, null, 2));
  }
};
