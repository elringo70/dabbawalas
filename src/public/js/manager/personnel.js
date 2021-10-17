addEventListener('load', async () => {
    await loadPersonnel()
})

async function loadPersonnel() {
    const path = `/api/managers/getPersonnel`

    try {
        const data = await fetch(path)
        const response = await data.json()
        renderPersonnel(response.personnel)
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}

function renderPersonnel(employees) {
    
    const personnelList = document.getElementById('personnel-list')
    employees.map(employee =>{
        personnelList.innerHTML = ''
        const tr = document.createElement('tr')
        tr.classList.add('text-center')

        let position
        if(employee.usertype == 'CA') {
            position = 'CAJERO'
        }
        if(employee.usertype == 'CO') {
            position = 'COCINERO'
        }

        const content = `
            <td>${employee.id_user}</td>
            <td>${employee.email}</td>
            <td>${employee.fullname}</td>
            <td>${employee.address}</td>
            <td>${employee.dob}</td>
            <td>${employee.phone}</td>
            <td>${position}</td>
            <td>
                <div class="btn-group">
                    <a data-product="${employee.id_user}" class="btn btn-outline-danger delete-product" name="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path
                                d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </a>
                    <a href="/api/products/editProductByIdPage/${employee.id_user}"
                        class="btn btn-outline-primary edit-product">
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
    })
}