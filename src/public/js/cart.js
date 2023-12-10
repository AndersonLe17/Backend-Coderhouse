const tableCart = document.querySelector('#dtCart');
const userData = {};

loadUser();

async function loadUser() {
    await fetch('http://localhost:8080/api/users/cart')
    .then((res) => res.json())
    .then((data) => {
        userData.user = data.payload._id;
        userData.cart = data.payload.cart || null;
        loadCart();
    });
}

async function loadCart() {
    const res = await fetch(`http://localhost:8080/api/carts/${userData.cart}`);
    const data = await res.json();
    data.payload.products.forEach((prod) => {
        tableCart.children[1].innerHTML += `
            <tr>
                <td>${prod.product.title}</td>
                <td>$${prod.product.price}</td>
                <td>${prod.quantity}</td>
                <td>$${prod.product.price * prod.quantity}</td>
                <td>
                    <i class="fa-light fa-trash btn btn-outline-danger rounded-pill" data-id="${prod.product._id}"></i>
                </td>
            </tr>
        `;
    });
}