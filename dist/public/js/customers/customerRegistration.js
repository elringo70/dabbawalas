//Listeners
document.getElementById('phone').addEventListener('change', findCustomerByPhone)

//Remove more than 10 characters
document.getElementById('phone').addEventListener('keyup', function (e) {
    if (event.target.value.length > 4) {
        event.target.value = event.target.value.slice(0, 10);
    }
})

document.getElementById('form').addEventListener('submit', formValidation)

//Functions
async function formValidation(e) {
    e.preventDefault()

    const findPhone = await findCustomerByPhone(e)

    if (findPhone) {
        const confirmation = window.confirm('¿Desea continuar con el registro?')

        if (confirmation) {
            const path = `/api/customers/postNewCustomer`
            const formData = new URLSearchParams();

            for (const pair of new FormData(form)) {
                formData.append(pair[0], pair[1]);
            }

            try {
                if (confirmation) {
                    const response = await fetch(path, {
                        method: 'POST',
                        body: formData
                    })

                    const data = await response.json()

                    if (data.status === 304) {
                        return sendInputAlert(data.errorMessage, 'alert-danger', 'formAlert')
                    }

                    if (data.status === 201) {
                        alert('Cliente guardado con éxito')
                        form.reset()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}

async function findCustomerByPhone(e) {
    const phone = e.target.value
    const path = `/api/customers/findCustomerByPhone/${phone}`

    try {
        const data = await fetch(path)

        const response = await data.json()

        if (response.status === 200) {
            alert(response.message)
            const phone = document.getElementById('phone')
            phone.value = ''
            return false
        }
        return true
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
}
