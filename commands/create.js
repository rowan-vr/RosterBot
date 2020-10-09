const roster = require("../roster")
module.exports = {
    name: 'createroster',
    description: 'Create a roster',
    execute(client, message, args) {
        if(args.length == 0) {
            return message.channel.send("Please supply arguments, GUI is WIP")
        } else {
            let template = args[0]
            let roles = args[1]
            if (template === undefined || roles === undefined) return message.channel.send("You did not supply the right arguments")
            roster.message(template, message.guild, roles).then(m => {
                if (m.length > 1999){
                    let m_lines = m.split("\n")
                    var send_msg = ""
                    let i = 0
                    let processed = 0
                    m_lines.forEach(m_line => {
                        send_msg += m_line + "\n";
                        i++;
                        processed++;
                        if (i===20){
                            message.channel.send(send_msg)
                            send_msg = ""
                            i = 0
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