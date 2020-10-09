const roster = require("../roster")
module.exports = {
    name: 'createroster',
    description: 'Create a roster',
    execute(client, message, args) {
        console.log(args)
        if(args.length == 0) return message.channel.send("Please supply arguments, GUI is WIP")
        let template = args[0]
        let roles = args[1]
        if (template === undefined || roles === undefined) return message.channel.send("You did not supply the right arguments")
        roster.message(template, message.guild, roles).then(m => {
            message.channel.send(m)
        }).catch(e =>{
            message.channel.send(`An error occured\n\`${e}\``)
        })
    },
};