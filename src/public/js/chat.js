const socket = io();
const username = {};
const formLogin = document.querySelector('#formLogin');
const formMessage = document.querySelector('#formMessage');
const myChat = document.querySelector('#boxMessages');
const toast = new bootstrap.Toast(document.querySelector("#liveToast"));

getUser();

async function getUser() {
    const response = await fetch('http://localhost:8080/api/sessions/current').then(res => res.json());
    username.id = response.sub;
    username.email = response.email;
    username.firstName = response.firstName;
    getMessages();
}

socket.on('ioMessage', data => {
    if (data.action === 'Add') {
        const message = data.payload;

        myChat.innerHTML += `
            <div class="toast fade show mb-4 ${(message.user._id === username.id)&& 'ms-auto'}">
                <div class="toast-header">
                    <i class="fa-regular fa-user me-2"></i>
                    <strong class="me-auto">${message.user.firstName}</strong>
                </div>
                <div class="toast-body">
                    ${message.message}
                </div>
            </div>
        `;
        myChat.scrollTo(0, myChat.scrollHeight);
    }
});

formMessage.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e.target.message.value.trim() === '') return;
    const message = {
        user: username.id,
        message: e.target.message.value
    };

    const response = await fetch('http://localhost:8080/api/messages/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    });
    if (response.status == 401) showToast('danger', 'Unauthorized');
    e.target.message.value = '';
});

async function getMessages() {
    const response = await fetch('http://localhost:8080/api/messages/');
    const data = await response.json();
    data.payload.forEach(message => {
        myChat.innerHTML += `
            <div class="toast fade show mb-4 ${(message.user._id === username.id)&& 'ms-auto'}">
                <div class="toast-header">
                    <i class="fa-regular fa-user me-2"></i>
                    <strong class="me-auto">${message.user.firstName}</strong>
                </div>
                <div class="toast-body">
                    ${message.message}
                </div>
            </div>
        `;
    });
    myChat.scrollTo(0, myChat.scrollHeight);
}

const showToast = (color, mensaje) => {
    document.querySelector("#liveToast").classList.add(`text-bg-${color}`);
    document.querySelector("#liveToastBody").innerText = mensaje;
    toast.show();
}