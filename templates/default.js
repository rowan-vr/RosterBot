module.exports.construct = async function(message, roles) {
    let result = undefined
    let itemsProcessed = 0
    console.log(roles)
    JSON.parse("[" + roles + "]").forEach(element => async function(){
        console.log(element)
        let role = await message.guild.roles.fetch(element)
        result = result + role.name + '\n'
        role.members.forEach(member => {
            itemsProcessed++;
            result = result + member + '\n'
            if(itemsProcessed === members.array.length) {
                result = result + '\n'
            }
        })    
    });
    return result
}