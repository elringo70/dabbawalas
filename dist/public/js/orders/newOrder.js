let order = []
const productList = document.getElementById('product-list')

document.getElementById('form').addEventListener('submit', orderForm)
document.getElementById('clean-customer').addEventListener('click', removeCustomerCard)

document.getElementById('phone').addEventListener('change', async function (e) {
    e.preventDefault();

    const phone = document.getElementById('phone');
    const customer = await findCustomer(phone.value);

    if (customer) {
        displayCard(customer);
    } else {
        alert('El número del cliente no existe');
        phone.value = '';
    }
})

document.getElementById('btn-id-product').addEventListener('click', async function (e) {
    const idproduct = document.getElementById('id-product')
    const product = await findProduct(idproduct.value)

    if (!product) {
        alert('Platillo no encontrado')
        idproduct.value = ''
    } else {
        addItem(product, idproduct.value)
        idproduct.value = ''
    }
})

async function findProduct(id) {
    const path = `/api/products/getProductByIdByRestaurant`
    const item = {
        id
    }

    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })

        const data = await response.json()

        return data.product
    } catch (error) {
        console.log(error)
    }
}

async function findCustomer(phone) {
    const path = `/api/customers/getCustomerByPhone`

    const customerPhone = {
        phone: phone
    }

    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerPhone)
        })

        const data = await response.json()
        const customer = data.customer

        return customer
    } catch (error) {
        console.log(error)
    }
}

function displayCard(customer) {
    const customerCard = document.querySelectorAll('.customer-card-table')
    for (let i = 0; i < customerCard.length; i++) {
        customerCard[i].hidden = false
    }

    const customerCardInfo = document.getElementById('customer-card')
    customerCardInfo.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title" data-idcustomer="${customer.id_user}">${customer.name} ${customer.lastname}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Dirección</h6>
                <p class="card-text">${customer.street} ${customer.number}, ${customer.municipality}, ${customer.city}</p>
            </div>
        </div>
    `
}

function renderCart() {
    productList.innerHTML = ''
    order.map(item => {
        const tr = document.createElement('tr')
        tr.classList.add('product-item')
        tr.classList.add('text-center')
        tr.setAttribute('data-idproduct', item.id)
        const content = `
                <td class="productItem" id="product-id">${item.id}</td>
                <td><img src="/${item.image}" class="img-thumbnail" alt="${item.name}" width="150px"></td>
                <td>${item.name}</td>
                <td>$ ${item.price}</td>
                <td>
                    <input class="form-control quantity m-auto" type="number" name="quantity[]" min="1" value=${item.quantity} style="width: 75px;">
                </td>
                <td>
                    <div class="btn-group">
                        <a class="btn btn-outline-danger delete-product-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                <path
                                    d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                            </svg>
                            <span class="visually-hidden">Button</span>
                        </a>
                    </div>
                </td>
                <input type="number" name="product[]" value='${item.id}' hidden>
                <input type="number" name="price[]" value='${item.price}' hidden>
            `

        tr.innerHTML = content
        productList.append(tr)

        tr.querySelector('.delete-product-item').addEventListener('click', deleteProduct)
        tr.querySelector('.quantity').addEventListener('change', sumQuantity)
    })
    totalCart()
}

function deleteProduct(e) {
    const button = e.target.closest('.product-item')
    const idproduct = button.dataset.idproduct

    order.forEach(function (item) {
        if (item.id == idproduct) {
            const confirm = window.confirm('¿Desea quitar el platillo?')
            if (confirm) {
                order.splice(item, 1)
                return null
            }
        }
    })
    renderCart()
}

function sumQuantity(e) {
    const inputValue = e.target
    const tr = inputValue.closest('.product-item')
    const productId = tr.dataset.idproduct

    for (let i = 0; i < order.length; i++) {
        if (order[i].id == productId) {
            order[i].quantity = inputValue.value
            totalCart()
            return null
        }
    }
}

function totalCart() {
    let total = 0

    const totalAmount = document.getElementById('totalCart')

    order.forEach(function (item) {
        const price = Number(item.price)
        total += price * item.quantity
    })

    totalAmount.innerHTML = `$ ${total}`
}

function addItem(product) {
    const item = {
        id: product.id_product,
        image: product.image,
        name: product.name,
        price: product.price,
        quantity: 1
    }

    const input = document.getElementsByClassName('quantity')

    for (let i = 0; i < order.length; i++) {
        if (order[i].id == product.id_product) {
            order[i].quantity++
            input[i].value = order[i].quantity

            return null
        }
    }

    order.push(item)
    renderCart()
}

async function orderForm(e) {
    e.preventDefault()

    if (order.length <= 0) {
        return alert('No hay platillos agregados a la orden')
    }

    const formData = new URLSearchParams();

    for (const pair of new FormData(form)) {
        formData.append(pair[0], pair[1])
    }

    try {
        const orderConfirm = window.confirm('¿Esta completa la orden?')
        if (orderConfirm) {

            const phone = document.getElementById('phone').value
            formData.append('phone', phone)

            const id_restaurant = await findExistingOrder(phone)

            console.log(id_restaurant)

            if (id_restaurant.status === 200) {
                const confirm = window.confirm(id_restaurant.message)

                if (confirm) {
                    path = `/api/orders/postNewOrder`
                    const data = await fetch(path, {
                        method: 'POST',
                        body: formData
                    })
                    const response = await data.json()

                    if (response.status === 304) {
                        return alert(response.message)
                    } else {
                        alert('Orden generada con éxito')
                        removeCustomerCard()
                    }
                }
            } else {
                path = `/api/orders/postNewOrder`
                const data = await fetch(path, {
                    method: 'POST',
                    body: formData
                })
                const response = await data.json()

                if (response.status === 304) {
                    return alert(response.message)
                } else {
                    alert('Orden generada con éxito')
                    removeCustomerCard()
                }
            }
        }
    } catch (error) {
        console.log(error)
        alert(error)
    }
}

function removeCustomerCard() {
    const customerCard = document.querySelectorAll('.customer-card-table')
    for (let i = 0; i < customerCard.length; i++) {
        customerCard[i].hidden = true
    }

    const customerCardInfo = document.getElementById('customer-card')
    customerCardInfo.innerHTML = ''
    const phone = document.getElementById('phone')
    phone.value = ''
    order = []
    productList.innerHTML = ''
}

async function findExistingOrder(phone) {

    const path = `/api/orders/findExistingOrder/${phone}`

    try {
        const data = await fetch(path)
        const response = await data.json()
        return response
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}