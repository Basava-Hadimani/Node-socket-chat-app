

class users{
    constructor(){
        this.users = [];
    }

    getUsers(room){
        return this.users.filter((user)=> {
            return (user.room === room)
        })
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
    }

    getUser(id){
        return this.users.filter((user) => {
            return (user.id === id);
        })
    }

    deleteAndGetUpdatedList(id){
        this.users = this.users.filter((user) => {
            return (user.id !== id);
        })

        return this.users;
    }

}

module.exports = users