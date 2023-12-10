const tableCart = document.querySelector('#dtCart');
const tableDetail = document.querySelector('#detailCart');
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
                <td>$${prod.product.price.toFixed(2)}</td>
                <td>${prod.quantity}</td>
                <td>$${(prod.product.price * prod.quantity).toFixed(2)}</td>
                <td>
                    <i class="fa-light fa-trash btn btn-outline-danger rounded-pill" data-id="${prod.product._id}"></i>
                </td>
            </tr>
        `;
    });

    const amount = data.payload.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0).toFixed(2);
    tableDetail.children[0].innerHTML += `
        <tr>
            <th>SubTotal</th>
            <td>$${(amount * 0.82).toFixed(2)}</td>
        </tr>
        <tr>
            <th>IGV</th>
            <td>$${(amount * 0.18).toFixed(2)}</td>
        </tr>
        <tr>
            <th>Total</th>
            <td class="fw-bold">$${amount}</td>
        </tr>
    `;
}

document.querySelector('#btnPurchase').addEventListener('click', async () => {
    const response = await fetch(`http://localhost:8080/api/carts/${userData.cart}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({uid: userData.user})
    }).then((res) => res.json());
    if (response.code === 200) {
        Swal.fire({
            icon: "success",
            title: 'Purchase completed successfully',
            text: "Your purchase has been completed successfully, a email has been sent to your email address with the details of your purchase.",
            confirmButtonText: 'Ok',
            allowOutsideClick: false
        }).then(result => {
            if (result.isConfirmed) location.reload();
        });
    }
});