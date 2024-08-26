const fs = require("fs")
const axios = require("axios")
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

// Set your bot's API token
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const FormData = require('form-data');

// Create a new Telegram bot
const bot = new TelegramBot(BOT_TOKEN);

// Define a function to handle incoming messages
bot.on('message', async (message) => {
    const chatId = message.chat.id;
    const messageText = message.text;
    if (messageText === '/start') {
        bot.sendMessage(chatId, 'Welcome to the OCR bot!');
    }
    console.log(message)
    if (message.document?.mime_type === 'application/pdf') {
        const fileId = message.document.file_id
        bot.getFile(fileId).then(async (file) => {
            try {
                // Save the photo to a temporary file
                console.log('ffffxxxx', file)
                const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`
                const form = new FormData();
                form.append("url", fileUrl)
                try {
                    const response = await axios.post(`${process.env.BACKEND_URL}/convertPdf`, form)
                    response.data.text.map(item => (
                        bot.sendMessage(message.chat.id, item.text)
                    ))

                } catch (e) {
                    bot.sendMessage(message.chat.id, 'picture is not suitable');

                }
            } catch (error) {
                // Handle the error
                console.error(error);
            }
        });

    }

    if (message.document?.mime_type === 'image/jpeg' || message.document?.mime_type === 'image/png') {
        const fileId = message.document.file_id
        bot.getFile(fileId).then(async (file) => {
            try {
                const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`
                const form = new FormData();
                form.append("url", photoUrl)
                try {
                    const response = await axios.post(`${process.env.BACKEND_URL}/convert`, form)
                    bot.sendMessage(message.chat.id, response.data.text);

                } catch (e) {
                    bot.sendMessage(message.chat.id, 'picture is not suitable');

                }
            } catch (error) {
                // Handle the error
                console.error(error);
            }
        });
    }
    // If the user has uploaded a picture
    if (message.photo) {
        // Get the photo's file ID

        const fileId = message.photo[message.photo.length - 1].file_id;
        bot.getFile(fileId).then(async (file) => {
            try {
                const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`
                const form = new FormData();
                form.append("url", photoUrl)
                try {
                    const response = await axios.post(`${process.env.BACKEND_URL}/convert`, form)
                    bot.sendMessage(message.chat.id, response.data.text);

                } catch (e) {
                    bot.sendMessage(message.chat.id, 'picture is not suitable');

                }
            } catch (error) {
                // Handle the error
                bot.sendMessage(message.chat.id, error);
                console.error(error);
            }
        });
    }
});

// Start the bot
bot.startPolling();
