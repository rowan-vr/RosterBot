const roster = require("../roster");
const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
    name: 'create',
    description: 'Create a roster',
    execute(client, message, args) {
        if(args.length == 0) {
            message.delete()
            GUI(message).then().catch(e => message.channel.send(e))
        } else {
            let template = args[0]
            let roles = args[1]
            if (template === undefined || roles === undefined) return message.channel.send("You did not supply the right arguments")
            roster.message(template, message.guild, roles).then(m => {
                if (m.length > 1999){
                    let m_lines = m.split("\n")
                    var send_msg = ""
                    let processed = 0
                    m_lines.forEach(m_line => {
                        send_msg += m_line + "\n";
                        processed++;
                        if (send_msg.length + m_line.length > 1999){
                            message.channel.send(send_msg)
                            send_msg = ""
                        }
                        if (processed === m_lines.length) message.channel.send(send_msg)
                    });
                } else {
                    message.channel.send(m)
                }
            }).catch(e =>{
                message.channel.send(`An error occured\n\`${e}\``)
            })   
        }
    },
};

function GUI(message){
    return new Promise(async function(resolve, reject){
        m = await message.channel.send("Constructing GUI...")
        var Embed = await new Discord.MessageEmbed()
        .setTitle("**Roster Creator!**")
        // .setDescription("React with the number you wish to edit, react with :checkmark: if done.")
        .addField('**1** - Template', 'To be chosen')
        .addField('**2** - Roles', 'To be chosen')
        m.edit("", Embed)
        m2 = await message.channel.send("Loading the templates...")
        var templates = ""
        var templates = await roster.getTemplates()
        let i = 0
        var templates_message = "**__Choose the template!__**\n_Reply with then number of the template you want to use_\n"
        for (template of templates){
            templates_message += `**${i+1}** - ${template.split(".")[0]}\n`
            // console.log(templates_message)
            i++;
        }
        m2.edit(templates_message)
        const filter = response => {
            return message.author.id === message.author.id ;
        };
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const response = collected.first()
            if (isNaN(response.content)) return reject("u bent dom")
        }).catch(e => {
            if (e.first() === undefined) e = "You took too long, we aborted the roster creation."
            reject(e)
        })
        // await m.react("1️⃣")
        // await m.react("2️⃣")
        // m.awaitReactions()
        // while (true){

        // }
    })
}