const Discord = require("discord.js");
const client = new Discord.Client(); 
const config = require("./config.json"); 
const jimp =require("jimp");
const toApng = require('gif-to-apng')
const download = require('download-file')


client.on("ready", () => {
  console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`); 
  client.user.setPresence({ game: { name: 'Gangnam Style', type: 2, url: 'https://www.youtube.com/watch?v=9bZkp7q19f0'} });
    //  0 = Jogando
    //  1 = Transmitindo
    //  2 = Ouvindo
    //  3 = Assistindo
});

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const comando = args.shift().toLowerCase();
  
  // coamdno ping
  if(comando === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
  }

  if (comando === "apng"){
  
    let info = {filename: "emoji.gif"}  
    let [nome, emojilink] = args
    if(!args[0]) return message.reply("Você esqueceu de definir os argumentos\n !apng <nome> <link.gif>");
    if(!args[1]) return message.channel.send("Você esqueceu de definir o link do emoji\n !apng <nome> <link.gif>");
      
      download(emojilink, info, function(err){
        if (!err)  {
        console.log("gif identificado")
        toApng('emoji.gif')
       .then(() => {
         message.guild.createEmoji('emoji.png', nome)
         message.channel.send("O gif-emoji foi convertido para o modo NITRO-Pobre é adicionado!!!")
        })
       .catch(error => console.log('não consegui converter a imagem💀', error))
        }else {
          message.channel.send("Link invalido")
        }
      })
      
    
    }
    
  
});

client.on("guildMemberAdd", async member => {

    let canal = client.channels.get("551917020715810825")
    let fonte = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
    let mask = await jimp.read('images/mascara.png')
    let fundo = await jimp.read('images/fundo.png')
    
    jimp.read(member.user.displayAvatarURL).then(avatar => {
    avatar.resize(130, 130)
    mask.resize(130, 130)
    avatar.mask(mask)
  
    fundo.print(fonte, 170, 175, member.user.username)
    fundo.composite(avatar, 40, 90).write('bemvindo.png')
    canal.send(``, { files: ["bemvindo.png"] })
    
    console.log('Imagem enviada para o Discord')
    })
    .catch(err => {
    console.log('error avatar')
    })
  });

client.login(config.token);