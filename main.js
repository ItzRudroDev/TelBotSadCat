
const { Telegraf } = require('telegraf');
const axios = require('axios');
const { token, ytapi } = require('./config');
const { helpmsg } = require('./resources/messages');

const bot = new Telegraf(token);

bot.start(ctx => {
    ctx.reply('I got started.');
});

//Saying welcome and bye on users join and leave.
bot.on('new_chat_members', ctx => {
    if (ctx.message.new_chat_participant.username == 'ss3000bot') {
        ctx.reply("Welcome me guys....I am Sad Cat not really sad. Use /help.")
    } else {
        ctx.reply(`Welcome ${ctx.message.new_chat_participant.username} to the group.`);
    }
});

bot.on('left_chat_member', ctx => {
    ctx.reply(`${ctx.message.left_chat_participant.username} just left the group.`)
});
// END

//Help command
bot.help(ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Hello World! How can I help you?", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Commands List', callback_data: 'cmdlist' }
                ],
                [
                    { text: 'Contact Support', url: 'https://t.me/+E9Qekg9jYp9lNThl' }
                ]
            ]
        }
    })
});

bot.action('cmdlist', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, helpmsg, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Homepage', callback_data: 'homeback' }
                ]
            ]
        }
    });
});

bot.action('homeback', ctx => {
    ctx.answerCbQuery();
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, "Hello World! How can I help you?", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Commands List', callback_data: 'cmdlist' }
                ],
                [
                    { text: 'Contact Support', url: 'https://t.me/+E9Qekg9jYp9lNThl' }
                ]
            ]
        }
    })
})

// END

// Echo command
bot.command('echo', ctx => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");
    if (inputArray.length == 1) {
        ctx.reply("Please mention me what I have to say. Example - /echo Hello");
    } else {
        inputArray.shift();
        input = inputArray.join(" ");
        ctx.reply(input);
    }
})
//END

// Loop commands to loop sms
let looping = '';
let loopCount = 1;
bot.command('loop', ctx => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");
    if (inputArray.length == 1 && looping == '') {
        ctx.reply("Please mention me what to loop. Example - /loop Hello.")
    } else {
        inputArray.shift()
        input = inputArray.join(" ");
        if (looping == '') {
            looping = setInterval(() => {
                ctx.reply(input);
                tryToClear(ctx);
            }, 2000);
        } else {
            ctx.reply('Looping is already in progress.');
        }
    }
});
bot.command('loopstop', ctx => {
    if (looping !== '') {
        clearInterval(looping);
        looping = '';
        loopCount = 1;
        ctx.reply("Stopped looping");
    } else {
        ctx.reply('No looping is going on.');
    }
});
const tryToClear = (ctx) => {
    if (loopCount < 11) {
        loopCount++;
    } else {
        clearInterval(looping);
        looping = '';
        ctx.reply('Looping stopped automatically as limit reached.');
        loopCount = 1;
    }
}
//END

//Random quote command
bot.command('quote', ctx => {
    axios.get("https://api.quotable.io/random?maxLength=50")
        .then(res => {
            ctx.reply(res.data.content);
        }).catch(err => {
            console.log(err);
        })
});
//END

//Random cat with text in pi command
bot.command('cat', ctx => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");
    if (inputArray.length == 1) {
        axios.get("https://aws.random.cat/meow")
            .then(res => {
                ctx.replyWithPhoto(res.data.file);
            })
    } else {
        inputArray.shift();
        input = inputArray.join(" ");
        ctx.telegram.sendPhoto(ctx.chat.id, `https://cataas.com/cat/says/${input}`);
    }
})
//End

// Search something on youtube
bot.command('ytsearch', ctx => {
    const maxytres = 1;
    var searchContent = ctx.message.text;
    var searchContentArray = searchContent.split(" ");
    if (searchContentArray.length == 1) {
        ctx.reply("Please mention me that what I have to search. Example - '/ytsearch <what to search>'");
    } else {
        searchContentArray.shift();
        searchContent = searchContentArray.join(" ");
        const ytlink = `https://www.googleapis.com/youtube/v3/search?key=${ytapi}&type=video&part=snippet&maxResults=${maxytres}&q=${searchContent}`;

        axios.get(ytlink).then(res => {
            res.data.items.forEach(items => {
                ctx.reply(`http://www.youtube.com/embed/${items.id.videoId}`);
            })
        }).catch(err => {
            console.log(err);
        })
    }
})
//END

bot.launch().then(() => {
    console.log("Sad cat is launched.");
})