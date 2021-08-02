const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');

const TELEGRAM_API_KEY = 'Your API telegram bot will be here';
const YA_API_KEY = 'Your Yandex API';

const bot = new TelegramBot(TELEGRAM_API_KEY, {polling: true});


bot.on('voice', (msg) => {
  const stream = bot.getFileStream(msg.voice.file_id);

  let chunks = [];
  stream.on('data', chunk => chunks.push(chunk));


  stream.on('end', () => {
      const axiosConfig = {
        method: 'POST',
        url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
        headers: {
          Authorization: 'Api-Key ' + YA_API_KEY,
        },
        data: Buffer.concat(chunks),
      };

      axios(axiosConfig)
      .then((response) => {
        const command = response.data.result;
        bot.sendMessage(msg.chat.id, command)
        if(command === 'Выключи компьютер') {
          bot.sendMessage(msg.chat.id, command)
        }

        if(command === 'Удали файл') {
          fs.unlinkSync('./test.txt')
          bot.sendMessage(msg.chat.id, 'Файл test.txt был удален')
        }
      }) 
      .catch ((err) => {
        console.log('Ошибка при распознавания речи: ', err);
      })
  })


  
});
