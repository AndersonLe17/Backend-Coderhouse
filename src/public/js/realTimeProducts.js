const socket = io();
const table = new DataTable('#dtProducts', {scrollX: true});

const form = document.getElementById('formProduct');
const modal = new bootstrap.Modal(document.getElementById('modalProducts'), {keyboard: false});
const toast = new bootstrap.Toast(document.querySelector(".toast"));

socket.on('ioProduct', data => {
    if (data.action === 'Add') {
        const prod = data.payload;

        table.row.add([
            // prod._id,
            prod.code,
            `<img src="${prod.thumbnail}" alt="${prod.title}" width="75">`,
            prod.title,
            `<div style="width: 17.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${prod.description}</div>`,
            '$' + prod.price,
            prod.stock,
            prod.category,
           `<span class="badge rounded-pill text-bg-${(prod.status)? "success":"danger"}">${(prod.status)? "Active":"Inactive"}</span>`,
           `<i class="fa-regular fa-pen-to-square btn btn-outline-secondary rounded-pill" data-id-edit=${prod._id}></i>
           <i class="fa-regular fa-trash btn btn-outline-danger rounded-pill" data-id-delete="${prod._id}"></i>`
        ]).draw(false);
    } else if (data.action === 'Delete') {
        const tr = document.querySelector(`[data-id-delete="${data.payload}"]`).parentElement.parentElement;
        table.row(tr).remove().draw(false);
    } else if (data.action === 'Update') {
        const tr = document.querySelector(`[data-id-edit="${data.payload._id}"]`).parentElement.parentElement;
        const prod = data.payload;

        table.row(tr).data([
            // prod._id,
            prod.code,
            `<img src="${prod.thumbnail}" alt="${prod.title}" width="75">`,
            prod.title,
            `<div style="width: 17.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">${prod.description}</div>`,
            '$' + prod.price,
            prod.stock,
            prod.category,
            `<span class="badge rounded-pill text-bg-${(prod.status)? "success":"danger"}">${(prod.status)? "Active":"Inactive"}</span>`,
            `<i class="fa-regular fa-pen-to-square btn btn-outline-secondary rounded-pill" data-id-edit=${prod._id}></i>
            <i class="fa-regular fa-trash btn btn-outline-danger rounded-pill" data-id-delete="${prod._id}"></i>`
        ]).draw(false);
    }
});

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const isSave = data.get('pid') === "";

    if (isSave) await addProduct(data);
    else await updateProduct(data);
});

const addProduct = async(data) => {
    data.delete('pid');

    const res = await fetch("http://localhost:8080/api/products/", {
        method: 'POST',
        body: data
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
}

const updateProduct = async(data) => {
    const res = await fetch(`http://localhost:8080/api/products/${data.get('pid')}`, {
        method: 'PUT',
        body: data
    }).then(res => res.json());

    cleanToast();
    if (res.code === 200) {
        modal.hide();
        showToast("success", res.message);
    } else if (res.code === 400) {
        showToast("danger", res.message);
    } else {
        showToast("danger", res.message);
    }
}

document.getElementById('listProducts').addEventListener('click', async(e) => {
    if (e.target.dataset.idDelete) {
        const id = e.target.dataset.idDelete;
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
    } else if (e.target.dataset.idEdit) {
        const id = e.target.dataset.idEdit;
        const res = await fetch(`http://localhost:8080/api/products/${id}`).then(res => res.json());
        if (res) {
            const product = res.payload;
            modal.show();
            document.getElementById('pid').value = id;
            document.getElementById('code').value = product.code;
            document.getElementById('title').value = product.title;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;
            document.getElementById('category').value = product.category;
        }
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

document.getElementById("modalProducts").addEventListener('hidden.bs.modal', () => {
    form.reset();
    document.getElementById('pid').value = null;
});

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