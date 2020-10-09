const fs = require("fs");
module.exports.message = (template, guild, roles) => {
    return new Promise(function(resolve,reject){
        fs.readdir("./templates/", (err, files) => {
            if (err) return reject(err);
            template = template + '.js'
            let file = files.find(a => a === template)
            if(file === undefined) {
                // throw new Error("This template has not been found!");
                return reject("This template has not been found!") 
            } else {
                const template = require('./templates/' + file);
                template.construct(guild, roles).then(m => resolve(m)).catch(e => reject(e));
            }
        })
    })
}