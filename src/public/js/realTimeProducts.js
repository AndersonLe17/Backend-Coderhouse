const socket = io();
const table = new DataTable('#dtProducts', {scrollX: true});

const formAdd = document.getElementById('formAddProduct');
const modal = new bootstrap.Modal(document.getElementById('modalProducts'), {keyboard: false});
const toast = new bootstrap.Toast(document.querySelector(".toast"));

socket.on('ioProduct', data => {
    if (data.action === 'Add') {
        const prod = data.payload;

        table.row.add([
            // prod._id,
            prod.code,
            prod.title,
            `<div style="width: 17.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${prod.description}</div>`,
            '$' + prod.price,
            prod.stock,
            prod.category,
           `<span class="badge rounded-pill text-bg-${(prod.status)? "success":"danger"}">${(prod.status)? "Active":"Inactive"}</span>`,
           `<i class="fa-regular fa-trash btn btn-outline-danger rounded-pill" data-id="${prod._id}"></i>`
        ]).draw(false);
    } else if (data.action === 'Delete') {
        const tr = document.querySelector(`[data-id="${data.payload}"]`).parentElement.parentElement;
        table.row(tr).remove().draw(false);
    }
});

formAdd.addEventListener('submit', async(e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const product = Object.fromEntries(data);

    const res = await fetch("http://localhost:8080/api/products/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    }).then(res => res.json());

    cleanToast();
    if (res.code === 201) {
        modal.hide();
        showToast("success", res.message);
    } else if (res.code === 400) {
        showToast("danger", res.message);
    } else {
        showToast("danger", res.message);
    }
});

document.getElementById('listProducts').addEventListener('click', async(e) => {
    if (e.target.dataset.id) {
        const id = e.target.dataset.id;
        Swal.fire({
            icon: 'question',
            title: 'Are you sure to remove the product?',
            showDenyButton: true,
            denyButtonText: `Cancel`,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#198754'
        }).then(result => {
            if (result.isConfirmed) deleteProducto(id);
        });
    }
});

const deleteProducto = async(id) => {
    const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    cleanToast();
    showToast("danger",res.message);
}

const cleanToast = () => {
    document.querySelector(".toast").classList.remove("text-bg-success");
    document.querySelector(".toast").classList.remove("text-bg-danger");
    document.querySelector(".toast-body").innerText = "";
}

const showToast = (color, mensaje) => {
    document.querySelector(".toast").classList.add(`text-bg-${color}`);
    document.querySelector(".toast-body").innerText = mensaje;
    toast.show();
}