const table = new DataTable('#dtUsers');

const form = document.getElementById('formUser');
const modal = new bootstrap.Modal(document.getElementById('modalUsers'), {keyboard: false});
const toast = new bootstrap.Toast(document.querySelector(".toast"));


form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const uid = document.getElementById('uid').value;
    const role = document.getElementById('role').value;

    const res = await fetch(`http://localhost:8080/api/users/role/${uid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({role}),
    }).then(res => res.json());
    modal.hide();
    const tr = document.querySelector(`[data-id-edit="${uid}"]`).parentElement.parentElement;
    tr.children[2].textContent = res.payload.role;
})

const deleteUser = async(id) => {
    const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
    if (res.code === 200) {
        const tr = document.querySelector(`[data-id-delete="${id}"]`).parentElement.parentElement;
        table.row(tr).remove().draw(false);
    }
}

document.getElementById('listUsers').addEventListener('click', async(e) => {
    if (e.target.dataset.idDelete) {
        const id = e.target.dataset.idDelete;
        Swal.fire({
            icon: 'question',
            title: 'Are you sure to remove this user?',
            showDenyButton: true,
            denyButtonText: `Cancel`,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#198754'
        }).then(result => {
            if (result.isConfirmed) deleteUser(id);
        });
    } else if (e.target.dataset.idEdit) {
        const id = e.target.dataset.idEdit;
        const res = await fetch(`http://localhost:8080/api/users/find/${id}`).then(res => res.json());
        if (res) {
            const user = res.payload;
            modal.show();
            document.getElementById('uid').value = user._id;
            document.getElementById('firstName').value = user.firstName;
            document.getElementById('lastName').value = user.lastName;
            document.getElementById('email').value = user.email;
            document.getElementById('status').value = user.status;
            document.getElementById('role').value = user.role;
        }
    }
})

document.getElementById("modalUsers").addEventListener('hidden.bs.modal', () => {
    form.reset();
    document.getElementById('uid').value = null;
});