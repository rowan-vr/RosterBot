const roster = require("../roster");
const Discord = require('discord.js');
const fs = require('fs');
const { config } = require("process");
module.exports = {
    name: 'create',
    description: 'Create a roster',
    execute(client, message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("You do not have the required permission to use this command. If you believe this is a mistake contact your server administrator.")
        if(args.length == 0) {
            message.delete()
            GUI(message)
            .then(m => {
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
            })
            .catch(e => message.channel.send(e))
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
        var stop = false
        var chosen_template = "To be chosen"
        var chosen_roles = "To be chosen"
        var Embed = await new Discord.MessageEmbed()
        .setTitle("**Roster Creator!**")
        // .setDescription("React with the number you wish to edit, react with :checkmark: if done.")
        .addField('**1** - Template', chosen_template)
        .addField('**2** - Roles', chosen_roles)
        m.edit("", Embed)
        m2 = await message.channel.send("Loading the templates...")
        const templates = await roster.getTemplates()
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
        await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const response = collected.first()
            if (isNaN(response.content)) reject("Your repsonse was not a valid option")
            // console.log(templates[parseInt(response.content) - 1])
            if (templates[parseInt(response.content) - 1] === undefined) reject("Your repsonse was not a valid option")
            chosen_template = templates[parseInt(response.content) - 1].split(".")[0]
            response.delete()
        }).catch(e => {
            stop = true
            if (e === undefined) e = "You took too long, we aborted the roster creation."
            reject(e)
        })
        if (stop === true) return
        m2.delete()
        var Embed = await new Discord.MessageEmbed()
        .setTitle("**Roster Creator!**")
        .addField('**1** - Template', chosen_template)
        .addField('**2** - Roles', chosen_roles)
        m.edit("", Embed)
        m3 = await message.channel.send("Loading the roles...")
        const RoleManager = await message.guild.roles.fetch()
        const roles = RoleManager.cache.array()
        // console.log(roles.array())
        i = 0
        var role_message = "**__Choose the roles!__**\n_Reply with the numbers in correct order sperated with a comma, for example `4,2,5,7`\n_"
        for (role of roles) {
            // console.log(role)
            if (role.name === '@everyone') role_message += `**${i+1}** - \`@everyone\`\n`; else role_message += `**${i+1}** - ${role.name}\n`
            // console.log(templates_message)
            i++;
        }
        m3.edit(role_message)
        var chosen_roles_ids = []
        await message.channel.awaitMessages(filter, { max: 1, time: 50000, errors: ['time'] })
        .then(collected => {
            const response = collected.first().content.split(",")
            collected.first().delete()
            // response = response.split(",")
            if(response === undefined) response = collected.first().content
            chosen_roles = ""
            response.forEach(res => {
                if (roles[parseInt(res)-1] === undefined) reject("Your repsonse was not a valid option")
                chosen_roles += `${roles[parseInt(res)-1].name}\n`
                chosen_roles_ids.push(roles[parseInt(res)-1].id)
            })
        }).catch(e => {
            stop = true
            if (e === undefined) e = "You took too long, we aborted the roster creation."
            reject(e)
        })
        if (stop === true) return
        m3.delete()
        var Embed = await new Discord.MessageEmbed()
        .setTitle("**Roster Creator!**")
        .addField('**1** - Template', chosen_template)
        .addField('**2** - Roles', chosen_roles)
        m.edit("", Embed)
        m4 = await message.channel.send("**__Confirmation__**\nAre you sure you want to post this roster?")
        await m4.react("✅")
        await m4.react("❎")
        const filter1 = (reaction, user) => {
            return user.id === message.author.id;
        };
        m4.awaitReactions(filter1, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first()
            if (reaction.emoji.name === '✅') {
                m4.delete()
                m.delete()
                roster.message(chosen_template, message.guild, chosen_roles_ids.join(",")).then(a => resolve(a))
            } else if (reaction.emoji.name === '❎') {
                m4.delete()
                reject("You have chosen to abort the roster creation")
            } else {
                m4.delete()
                reject("I dunno what this means man.............. Im going to crash now...........")
            }
        })
        .catch(e => {
            stop = true
            if (e === undefined) e = "You took too long, we aborted the roster creation."
            reject(e)
        });
        // await m.react("1️⃣")
        // await m.react("2️⃣")
        // m.awaitReactions()
        // while (true){

        // }
    })
}