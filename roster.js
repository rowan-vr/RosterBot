const fs = require("fs");
module.exports.message = function(template, message) {
    fs.readdir("./templates/", (err, files) => {
        if (err) return console.error(err);
        template = template + '.js'
        let file = files.find(a => a === template)
        if(file === undefined) {
            return message.channel.send("This template has not been found!") //throw new Error("This template has not been found!");
        } else {
        return file;
        }
    })
}