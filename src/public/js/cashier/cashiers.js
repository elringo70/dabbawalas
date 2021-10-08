let cashiers = []
//Listeners
document.getElementById('search').addEventListener('keyup', tableFilter)
addEventListener('load', async () => {
    await loadCashiers()
    renderCashiers()
})

//Functions
function tableFilter() {
    var input, filter, table, tr, td, i, txtValue

    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("cashiersTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2]

        if (td) {
            txtValue = td.textContent || td.innerText

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""
            } else {
                tr[i].style.display = "none"
            }
        }
    }
}

async function loadCashiers() {
    const path = `/api/managers/getCashiers`

    try {
        const data = await fetch(path)
        const response = await data.json()

        for (let i = 0; i < response.length; i++) {
            cashiers.push(response[i])
        }
    } catch (error) {
        if (error) console.log(error)
        window.alert(error)
    }
}

function renderCashiers() {
    const cashiersList = document.getElementById('cashiers-list')
    cashiersList.innerHTML = ''

    cashiers.map(cashier => {
        const tr = document.createElement('tr')
        tr.setAttribute('data-cashier', cashier.id_user)
        tr.classList.add('text-center')

        const dob = new Date(cashier.dob).toLocaleDateString("en-US")

        const content = `
            <td><a href="#">${cashier.id_user}</a></td>
            <td>${cashier.email}</td>
            <td>${cashier.name} ${cashier.lastname} ${cashier.maternalsurname}</td>
            <td>
                ${cashier.street} ${cashier.number}, ${cashier.municipality}, ${cashier.city}, ${cashier.state}
            </td>
            <td>${dob}</td>
            <td>${cashier.phone}</td>
            <td>
                <div class="btn-group">
                    <a
                    href="/api/customers/editCustomerByRestaurantPage/${cashier.id_user}"
                    data-customer-edit="${cashier.id_user}"
                    class="btn btn-outline-secondary edit-customer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </a>
                    <a data-order-delete="${cashier.id_user}"
                    class="btn btn-outline-danger delete-customer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path
                                d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </a>
                </div>
            </td>
        `

        tr.innerHTML = content
        cashiersList.append(tr)
    })
}