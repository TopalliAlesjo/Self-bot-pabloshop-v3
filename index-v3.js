        console.log('\n \x1b[33m%s\x1b[0m', 'starting...' );

        const Discord = require ("discord.js-selfbot-v13");
        const dotenv = require('dotenv');
        const config = require('./config.json');
        const axios = require('axios');
        const { createCanvas, loadImage } = require('canvas');
        const { WebhookClient } = require('discord.js');
        const { MessageEmbed } = require('discord.js');
        require('dotenv').config();
        const client = new Discord.Client({
          checkUpdate: false
        
        })
        
        client.login(process.env.TOKEN)
       
        //log errori tramite canale ds
        process.on('unhandledRejection', (reason, p) => {
          if (reason?.message === 'The request is missing a valid API key.') return;
        
          console.log(reason, p);
        
        });
        process.on('uncaughtException', (err, origin) => {
        
          console.log(err, origin);
        
        });
        process.on('uncaughtExceptionMonitor', (err, origin) => {
        
          console.log(err, origin);
        
        });
        process.on('multipleResolves', (type, promise, reason) => {
        
          console.log(type, promise, reason);
        
          });
        
        
        client.on("ready", async () => {
            console.log('\n \x1b[31m%s\x1b[0m', `${client.user.username} | ON ©Pablo🂱Shop SELFBOT `)
          client.user.setActivity(config.activity , {type: config["activity-type"]}) 
        
        })
        
        
        
        client.on('messageCreate', (message) => { // tutti i comandi 
        if (message.content.toLowerCase() === (config['command-1']) && message.author.id === (config["your-id"])) {
        message.reply(config['reply-1'])
        } else  if (message.content.toLowerCase() === (config['command-2']) && message.author.id === (config["your-id"])) {
        message.reply(config['reply-2'])
        } else if (message.content.toLowerCase() === (config['command-3']) && message.author.id === (config["your-id"])) {  
        message.reply(config['reply-3'])
        }else if (message.content.toLowerCase() === ('!help') && message.author.id === (config["your-id"])) {  
          message.reply("**!!! ONLY COMMANDS NOT FUNCTIONS (basilar-pabloshop-commands)!!!**\n \`V3-SELF-BOT-PABLOSHOP\` \n \n <> = required <[]> = optional \n \n > !paypal \n > !ltc \n > !shop \n  > !calc <number1> <operator> <number2> <[discount]> discount: optional operators: / * + - \n > !fattura <product> <price> \n > !mybalance \n > !balance (any addy) \n > !ltctoeur <number> \n > !eurtoltc <number>")
          }
        });
        
        
        // risposta a chi mi tagga
        const words = (config.words);
        const targetServerIds = (config.server); 
        
        
        client.on("messageCreate", async message => {
          if (message.author.id === client.user.id) {
            return; 
          }
          
          
          
          if (message.guild && targetServerIds.includes(message.guild.id) || (message.channel.type === config.dm || message.channel.type === config['group-dm'])) {
        
          if (message.mentions.everyone || message.mentions.here) {
            return; 
          }
          if (message.mentions.has(client.user.id)) {
          
          if (message.content.includes(words)) {
        
           message.reply(config["tag-reply"]);
           
           const webhookClient = new WebhookClient({ id: config["webhook-id-waitreply"], token: config["webhook-token-waitreply"] }); // webhook
        
           const embed = new MessageEmbed()
            .setTitle(config["title-embed-waitreply"])
            .setDescription(`**You received a mention**\n\n**Author:** <@${message.author.id}> \n\n**Channel:** <#${message.channel.id}>`)
            .setColor(config["color-embed-waitreply"]);
        
           webhookClient.send({ 
            content: (config["contentWebhook-waitreply"]),
            username: (config["usernameWebhook-waitreply"]),
            avatarURL: (config["avatarWebhook-waitreply"]),
            embeds: [embed],
      }) 
      }}
    }})



        client.on("messageCreate", async message => {
          
          if (message.content.includes('discord.gift' && 'discord.com/gifts') && message.author.id !== client.user.id) {
            const webhookClient = new WebhookClient({ id: config["webhook-id-nitro-sniper"], token: config["webhook-token-nitro-sniper"] });
        
            const embed1 = new MessageEmbed()
              .setTitle("NITRO SNIPED!")
              .setDescription(`||${message.content}|| \nRiscattalo prima che lo facciano gli altri! \n \n redeem it before others do! `)
              .setColor(config["color-embed"]);
        
            webhookClient.send({
              content: ("@everyone"),
              username: "NITRO SNIPER",
              avatarURL: config["avatarWebhook-nitro-sniper"],
              embeds: [embed1],

            })  
        }});
        const getLtcPrice = async () => {
          const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: 'litecoin',
              vs_currencies: 'eur',
            },
          });
          const data = response.data;
          return data.litecoin.eur;
        };
        
        client.on('messageCreate', async (message) => {
          if (message.author.id !== (config['your-id'])) {
            return; 
          }
        
          if (message.content.startsWith(config['command-eurtoltc'])) {
            const args = message.content.split(' ');
            if (args.length !== 2) {
              message.reply(':warning: = !eurtoltc <numero>');
              return;
            }
        
            const numero = parseFloat(args[1]);
        
            if (isNaN(numero)) {
              message.reply('Invalid entry. Make sure you enter a valid number. \n Input non valido. Assicurati di inserire un numero valido.');
              return;
            }
        
            const ltcPrice = await getLtcPrice();
            const valoreInLtc = numero / ltcPrice;
        
            const replyMessage = `**EXCHANGE**\n${numero}€ = ${valoreInLtc.toFixed(6)}  LTC `;
            message.reply(replyMessage);
          } else if (message.content.startsWith(config['command-ltctoeur'])) {
            const args = message.content.split(' ');
            if (args.length !== 2) {
              message.reply(':warning: = !ltctoeur <amount>');
              return;
            }
        
            const amount = parseFloat(args[1]);
        
            if (isNaN(amount)) {
              message.reply('Invalid entry. Make sure you enter a valid number. \n Input non valido. Assicurati di inserire un numero valido.');
              return;
            }
        
            const ltcEurRate = await getLtcPrice();
            const convertedAmount = (amount * ltcEurRate).toFixed(2);
        
            const replyMessage = `**EXCHANGE**\n${amount} LTC = ${convertedAmount}€`;
            message.reply(replyMessage);
          };
        })

        client.on('messageCreate', async (message) => {
          if (message.author.id !== (config['your-id'])) {
            return; 
          }

         if (message.content.startsWith(config["command-calcolator"])) { //calcolatrice
          const args = message.content.split(' ');
    
          if (args.length >= 4) {
            
            const numero1 = parseFloat(args[1].replace(',', '.'));
            const operatore = args[2];
            const numero2 = parseFloat(args[3].replace(',', '.'));
      
            let risultato;
      
            switch (operatore) {
              case '+':
                risultato = numero1 + numero2;
                break;
              case '-':
                risultato = numero1 - numero2;
                break;
              case '*':
                risultato = numero1 * numero2;
                break;
              case '/':
                risultato = numero1 / numero2;
                break;
              default:
                message.reply("Operatore non supportato / Operator not supported ");
                return;
            }
      
            // sconto
            if (args.length === 5) {
              const sconto = parseFloat(args[4].replace(',', '.'));
              risultato -= sconto;
            }
            risultato = risultato.toFixed(2);
            
            message.reply(`**Total:** \`${risultato}\``);
          } else {
            message.reply(" **ITA:** :warning: = ES. !calc <numero1> <operatore> <numero2> <[sconto]> \n sconto: opzionale \n operatori: `/` `*` `+` `-` \N \N **ENG:** :warning: =  ES. !calc <number1> <operator> <number2> <[discount]> \n discount: opzional \n operators: `/` `*` `+` `-`");
         }
        }
        });

        client.on('messageCreate', async (message) => {
          
          

          if (message.content.startsWith(config["command-fattura"]) && message.author.id === (config["your-id"])) {
            
            const args = message.content.slice("!".length).trim().split(' ');
            
            const prodotto = args[1];
            const prezzo = args[2];
        
            // creazione dello scontrino 
            const canvas = createCanvas(400, 200);
            const ctx = canvas.getContext('2d');

            //sfondo
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const logo1 = config["percorso-logo"];

            const logo = await loadImage(logo1);
            ctx.drawImage(logo, canvas.width - 100, 10, 90, 90); 
        
            // scontrino stile
            ctx.fillStyle = 'black';
            ctx.font = 'bold 24px "Times New Roman"';
            
            ctx.textAlign = 'center';
            ctx.fillText('Receipt', canvas.width / 2, 60);

            ctx.font = 'bold 16px "Times New Roman"';
            ctx.textAlign = 'left';
            ctx.fillText(`Product:`, 20, 120);
            ctx.font = '16px "Courier New"'; 
            ctx.fillText(`${prodotto}`, 20, 140);

            ctx.font = 'bold 16px "Times New Roman"';
            ctx.textAlign = 'right';
            ctx.fillText(`Paid:`, 380, 170); 
            ctx.font = 'blond 18px Arial';
            ctx.fillText(`${args.slice(2).join(' ')} €`, 376, 190); 


            ctx.font = '12px Arial';
            ctx.fillStyle = 'gray';
            ctx.fillText('©PabloShop', 75, canvas.height - 5);
        
          
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'scontrino.png');
            message.send
            message.reply({ files: [attachment] });

            // manda fattura in archivio
            const webhookClient = new WebhookClient({ id: config["webhook-id-fatture"], token: config["webhook-token-fatture"] }); // webhook
            webhookClient.send({ 
                files: [attachment],
                username: (config["usernameWebhook-fatture"]),
                avatarURL: (config["avatarWebhook-fatture"]),
            })

          }
        }); 
      
              
       client.on('messageCreate', (message) => { 

        async function getLitecoinBalance(address) {
          
          const api_url = `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`;
        
          try {
            
            const response = await axios.get(api_url);
        
            
            if (response.status === 200) {
              
              const data = response.data;
              const balanceLTC = data["balance"];
              return balanceLTC;
            } else {
              return "Errore nella richiesta all'API, \n \n Error in API request";
            }
          } catch (error) {
            return error.toString();
          }
        } 
         if (message.content.toLowerCase() === (config["command-mybalance"]) && message.author.id === (config["your-id"])) {
          
            const litecoinAddress = config["personal-ltc-addy"];
        
            
            getLitecoinBalance(litecoinAddress)
          .then((balance) => {
            let suca = balance / 100000000
            message.reply(`\n > **Balance:** \`${suca}\` **LTC**`);
          })
          .catch((error) => {
            console.error(error);
          });
        } 
        if (message.content.startsWith(config["command-balance"]) && message.author.id === (config["your-id"])) {
          
          const address = message.content.split(' ')[1];
          
          axios.get(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`)
            .then((response) => {
              const balance = response.data.balance;
              let ris = balance / 100000000
              message.channel.send(`> **Balance:** \`${ris}\` **LTC**`);
            })
            .catch((error) => {
              console.error(error);
              message.channel.send('Errore durante l\'ottenimento del bilancio. \n \n Error obtaining the balance sheet.');
            }); 
  }
})

