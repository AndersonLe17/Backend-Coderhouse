const tableProducts = document.getElementById('dtProducts');

const selectLimit = document.querySelector('select[name="limit"]');
const pagination = document.querySelector('.pagination');
const docs = document.querySelector('.docs');
const inputSort = document.querySelectorAll('input[name="sort"]');
const selectCategory = document.querySelector('select[name="category"]');
const inputStatus = document.querySelectorAll('input[name="status"]');

const toast = new bootstrap.Toast(document.querySelector(".toast"));
const params = {
    page: 1, 
    limit: selectLimit.value, 
    sort: Array.from(inputSort).find((radio) => radio.checked).value,
    category: selectCategory.value,
    status: Array.from(inputStatus).find((radio) => radio.checked).value
};
const userData = {};

loadCategories();
loadProducts();
loadCart();

async function loadCategories() {
    const res = await fetch('http://localhost:8080/api/products/categories/all');
    const data = await res.json();
    data.payload.forEach((cat) => {
        selectCategory.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

async function loadProducts() {
    const requestURL = prepareRequest();
    const res = await fetch(requestURL);
    const data = await res.json();
    tableProducts.children[1].innerHTML = '';
    data.payload.data.forEach((prod) => {
        tableProducts.children[1].innerHTML += `
            <tr>
                <td>${prod.code}</td>
                <td>${prod.title}</td>
                <td><div style="width: 17.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prod.description}</div></td>
                <td>$${prod.price}</td>
                <td>${prod.stock}</td>
                <td>${prod.category}</td>
                <td>
                    <span class="badge rounded-pill text-bg-${prod.status? 'success': 'danger'}">${prod.status? 'Active' : 'Inactive'}</span>
                </td>
                <td>
                    <i class="fa-regular fa-bag-shopping btn btn-outline-warning rounded-pill" data-id="${prod._id}"></i>
                </td>
            </tr>
        `;
    });

    loadPagination(data.payload);
}

async function loadCart() {
    const res = await fetch('http://localhost:8080/api/users/cart');
    const data = await res.json();
    userData.user = data.payload._id;
    userData.cart = data.payload.cart || null;
}

document.getElementById('listProducts').addEventListener('click', async (e) => {
    if (e.target.dataset.id && userData.cart) {
        addCartProduct(e.target.dataset.id);
    } else {
        const response = await fetch(`http://localhost:8080/api/carts`, {
            method: 'POST',
        }).then((res) => res.json());
        if (response.code === 201) {
            userData.cart = response.payload._id;
            addCartProduct(e.target.dataset.id);
        } else {
            showToast("danger", response.message);
        }
    }
});

async function addCartProduct(pid) {
    const res = await fetch(`http://localhost:8080/api/carts/${userData.cart}/product/${pid}`, {
        method: 'POST',
    });
    const data = await res.json();
    if (data.error) showToast("danger", data.message); 
    else if (data.code === 200) showToast("success", "Product added to cart");
}

function loadPagination({totalPages, page, totalDocs, hasPrevPage, hasNextPage}) {
    docs.innerHTML = `Mostrando ${(page - 1 ) * params.limit + 1 } a ${(page < totalPages)? page * params.limit : totalDocs} de ${totalDocs} productos`;

    const pages = (totalPages <= 7) 
        ? [...Array(totalPages).fill(1).map((v,i) => v + i)] 
        : (totalPages === 8 && page <= 4)
            ? [...Array(5).fill(1).map((v,i) => v + i),'...', 8]
            : (totalPages === 8 && page > 4)
                ? [1,'...', ...Array(9 - 4).fill(4).map((v,i) => v + i)]
                : (totalPages > 8 && page <= 4)
                    ? [...Array(5).fill(1).map((v,i) => v + i),'...', totalPages]
                    : (totalPages > 8 && page >= totalPages - 3)
                        ? [1,'...', ...Array((totalPages + 1) - (totalPages - 4)).fill(totalPages - 4).map((v,i) => v + i)]
                        : [1,'...',page - 1,page,page + 1,'...',totalPages];

    pagination.innerHTML = `
        <li class="page-item ${!hasPrevPage && 'disabled'}">
            <a class="page-link" href="#" data-page="${page - 1}">
                <i class="fa-regular fa-chevron-left" data-page="${page - 1}"></i>
            </a>
        </li>
    `;
    pages.forEach((p) => {
        pagination.innerHTML += `<li class="page-item ${(p === page)? 'active' : (p === '...') && 'disabled'}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
    });
    pagination.innerHTML += `
        <li class="page-item ${!hasNextPage && 'disabled'}">
            <a class="page-link" href="#" data-page="${page + 1}">
                <i class="fa-regular fa-chevron-right" data-page="${page + 1}"></i>
            </a>
        </li>
    `;
}

function prepareRequest() {
    const { page, limit, sort, category, status } = params;
    const href = new URL('http://localhost:8080/api/products');
    limit && href.searchParams.set('limit', limit);
    page && href.searchParams.set('page', page);
    (sort !== "none") && href.searchParams.set('sort', sort);
    (category !== 'all') && href.searchParams.set('category', category);
    (status !== 'none') && href.searchParams.set('status', status);
    return href.toString();
}

pagination.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.dataset.page && e.target.parentElement.classList.contains('active') === false) {
        params.page = e.target.dataset.page;
        loadProducts();
    }
});

selectLimit.addEventListener('change', (e) => {
    params.limit = e.target.value;
    params.page = 1;
    loadProducts();
});

inputSort[0].parentElement.addEventListener('change', (e) => {
    params.sort = e.target.value;
    loadProducts();
});

selectCategory.addEventListener('change', (e) => {
    params.category = e.target.value;
    params.page = 1;
    loadProducts();
});

inputStatus[0].parentElement.addEventListener('change', (e) => {
    params.status = e.target.value;
    params.page = 1;
    loadProducts();
});

const showToast = (color, mensaje) => {
    document.querySelector(".toast").classList.remove(`text-bg-danger`);
    document.querySelector(".toast").classList.remove(`text-bg-success`);
    document.querySelector(".toast").classList.add(`text-bg-${color}`);
    document.querySelector(".toast-body").innerText = mensaje;
    toast.show();
}