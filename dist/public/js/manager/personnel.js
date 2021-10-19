let personnel = []
const personnelList = document.getElementById('personnel-list')

addEventListener('load', async () => {
    await loadPersonnel()
})

document.getElementById('search').addEventListener('keyup', tableFilter)

async function loadPersonnel() {
    const path = `/api/managers/getPersonnel`

    try {
        const data = await fetch(path)
        const response = await data.json()

        if (response.personnel) {
            for (let i = 0; i < response.personnel.length; i++) {
                personnel.push(response.personnel[i])
            }

            renderPersonnel()
        }
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}

function tableFilter() {
    var input, filter, table, tr, td, i, txtValue

    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("personnel-table");
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

function renderPersonnel() {    
    personnelList.innerHTML = ''
    personnel.map(employee => {
        const tr = document.createElement('tr')
        tr.classList.add('text-center')

        let position
        if (employee.usertype == 'CA') {
            position = 'CAJERO'
        }
        if (employee.usertype == 'CO') {
            position = 'COCINERO'
        }

        const dob = new Date(employee.dob)

        const content = `
            <td>${employee.id_user}</td>
            <td>${employee.email}</td>
            <td>${employee.fullname}</td>
            <td>${employee.address}</td>
            <td>${dob.toLocaleDateString()}</td>
            <td>${employee.phone}</td>
            <td>${position}</td>
            <td>
                <div class="btn-group">
                    <a data-employee="${employee.id_user}" class="btn btn-outline-danger delete-employee">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path
                                d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </a>
                    <a data-employee="${employee.id_user}" class="btn btn-outline-primary edit-employee">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="bi bi-three-dots-vertical"
                            viewBox="0 0 16 16">
                            <path
                                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </a>
                </div>
            </td>
        `

        tr.innerHTML = content
        personnelList.append(tr)

        tr.querySelector('.delete-employee').addEventListener('click', async (e) => {
            await deleteEmployee(e, employee.id_user)
        })
    })
}

async function deleteEmployee(e, employee) {
    e.preventDefault()

    const path = `/api/deleteEmployeeById/${employee}`
    try {
        const confirm = window.confirm('¿Desea eliminar el usuario que esta seleccionando?')
        if (confirm) {
            const data = await fetch(path, {
                method: 'DELETE'
            })
            const response = await data.json()

            if (response.status === 304) return alert(response.message)
            if (response.status === 200) {
                alert(response.message)
                await reloadPersonnelList()
            }
        }
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}

async function reloadPersonnelList() {
    personnel = []
    await loadPersonnel()
    renderPersonnel()
}