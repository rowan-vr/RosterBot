const fs = require("fs");
module.exports.message = function(template, message) {
    fs.readdir("./templates/", (err, files) => {
        if (err) return console.error(err);
        template = template + '.js'
        console.log(files)
        let file = files.find(a => a = template)
        console.log(file)
        if(file != undefined) message.channel.send('This template has not been found!')
    })
}