const formForgot = document.querySelector('#formForgot');


formForgot.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const user = Object.fromEntries(data);
    const res = await fetch("http://localhost:8080/api/sessions/forgotPassword", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(res => res.json());
    if (res.code === 200) {
        Swal.fire({
            icon: "success",
            title: 'Email sent!',
            text: 'Check your email to reset your password',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) location.href = '/login';
        });
    }
});