const fs = require("fs");
module.exports.message = function(template, message, roles) {
    fs.readdir("./templates/", (err, files) => {
        if (err) return console.error(err);
        template = template + '.js'
        let file = files.find(a => a === template)
        if(file === undefined) {
            // throw new Error("This template has not been found!");
            return message.channel.send("This template has not been found!") 
        } else {
        const template = require('./templates/' + file);
        template.construct(message, roles).then(m => {
            message.channel.send(m)
        })}
    })
}