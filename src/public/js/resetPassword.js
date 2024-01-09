const formReset = document.querySelector('#formReset');
const divAlert = document.querySelector('#passwordAlert');

formReset.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const passwords = Object.fromEntries(data);
    if (passwords.password !== passwords.confirmPassword) return showAlert("Passwords do not match");
    const res = await fetch("http://localhost:8080/api/sessions/resetPassword", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwords)
    }).then(res => res.json());
    if (res.error) return showAlert(res.message);
    Swal.fire({
        icon: 'success',
        title: 'Password changed successfully',
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500
    }).then(() => {
        window.location.href = "/login";
    });
});

function showAlert(message) {
    divAlert.innerHTML = `
    <div class="alert alert-danger" role="alert">
        ${message}
    </div>
    `;
}