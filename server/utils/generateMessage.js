var moment = require('moment');

var generateMessage = (from, message, userName) => {
    return {
        from,
        message,
        createDate: moment().valueOf(),
        userName:userName
    }
}

module.exports = {generateMessage};
