module.exports = {
    listErrorMsg : (messages = []) => {
        ListMsg = [];
        messages.forEach(function(msgObject) {
            ListMsg.push(msgObject);
        })
        return ListMsg;
    }
}