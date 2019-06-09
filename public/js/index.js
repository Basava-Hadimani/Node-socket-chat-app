var socket = io();

socket.on('connect', () =>{
    console.log('Connected to server');
    socket.emit('join', jQuery.deparam(window.location.search), (err) => {
        if(err){
            alert('Valid chat room is required');
            window.location.href = '/';
        }


    })
})

socket.on('UserList', (users) => {
    var usersElement = jQuery('#users').empty();
    users.map((user) => {
        usersElement.append(`<li>${user.name}</li>`);
    })
})

socket.on('GREETING', (message) => {
    renderMessages(message);
})

socket.on('newMessage', (message) => {
    renderMessages(message);
})

socket.on('newUser', (message) => {
    renderMessages(message);
})

socket.on('disconnect', () => {
    console.log('Disconnected from server');
})

function renderMessages(message) {
    var messageElement = jQuery('#message-body').html();

    var messages = Mustache.render(messageElement, {
        from : message.from,
        createdAt : moment(message.createdAt).format('h:mm a'),
        message: message.message
    })

    jQuery('#messages').append(messages);
    autoSCroll();
}

function autoSCroll(){
    var clientHeight = jQuery('#messages').prop('clientHeight');
    var scrollHeight = jQuery('#messages').prop('scrollHeight');
    var scrollTop = jQuery('#messages').prop('scrollTop');

    if(scrollTop && (scrollTop + clientHeight <= scrollHeight)){
        jQuery('#messages').scrollTop(scrollHeight);
    }

}

jQuery('#message-form').on('submit', (event)=>{
    event.preventDefault();
    var messageInput = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: jQuery.deparam(window.location.search).name,
        message:messageInput.val(),
        room: jQuery.deparam(window.location.search)
    },() => {
        messageInput.val('');
    })
})