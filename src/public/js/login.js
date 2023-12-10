const bodyLogin = document.querySelector('#cardLogin');
const bodyRegister = document.querySelector('#cardRegister');
const toast = new bootstrap.Toast(document.querySelector(".toast"));

const btnChanges = document.querySelectorAll('.btn-change');
const formSignIn = document.querySelector('#formSignIn');
const formSignUp = document.querySelector('#formSignUp');
const btnGitHub = document.querySelector('#btnGitHub');

btnChanges.forEach(btn => {
    btn.addEventListener('click', () => {
        bodyLogin.classList.toggle('d-none');
        bodyRegister.classList.toggle('d-none');
    });
});

formSignUp.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const user = Object.fromEntries(data);
    const res = await fetch("http://localhost:8080/api/sessions/register/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(res => res.json());
    if (res.code !== 201) {
        showToast("User already exists");
    } else {
        window.location.href = "/home";
    }
});

formSignIn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const credentials = Object.fromEntries(data);
    const res = await fetch("http://localhost:8080/api/sessions/login/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(res => res.json());
    if (res.code !== 200) {
        showToast("User or password incorrect");
    } else {
        window.location.href = "/home";
    }
});

btnGitHub.addEventListener('click', async (e) => {
    location.href='/api/sessions/github';
});

const showToast = (mensaje) => {
    document.querySelector(".toast").classList.add(`text-bg-danger`);
    document.querySelector(".toast-body").innerText = mensaje;
    toast.show();
}