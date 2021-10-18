addEventListener('load', () => {
    dateInputRestriction()
})

document.getElementById('form').addEventListener('submit', submitForm)
document.getElementById('email').addEventListener('change', emailValidation)

async function submitForm(e) {
    e.preventDefault()

    const path = `/api/managers/postNewEmployee`
    try {

        const dobVal = dobValidation()
        const emailVal = emailValidation()

        if (dobVal &&
            emailVal) {
            const formData = new URLSearchParams();

            for (const pair of new FormData(form)) {
                formData.append(pair[0], pair[1])
            }

            const data = await fetch(path, {
                method: 'POST',
                body: formData
            })
            const response = await data.json()

            if (response.status === 200) {
                form.reset()
                resetSelect()
                alert(response.message)
            }
            if (response.status === 304) {
                alert(response.message)
            }
        } else {
            alert('Debe validar todos los campos')
        }
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}

function dobValidation() {
    const dateInput = document.getElementById('dob').value
    const date = new Date(dateInput)
    const actualYear = new Date().getFullYear()

    if ((actualYear - 18) < date.getFullYear()) {
        alert('Debe de ser mayor de edad para registrarse')
        return false
    } else {
        return true
    }
}

function dateInputRestriction() {
    const dateInput = document.getElementById('dob')
    let last18 = new Date()

    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(last18) - 18
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(last18)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(last18)

    last18 = ye + '-' + mo + '-' + da

    dateInput.setAttribute('max', last18)
}

async function emailValidation() {
    const email = document.getElementById('email').value

    if (email === null || email === '') {
        alert('Ingrese un correo electrónico')
        return false
    }

    const path = `/api/getUserByEmail/${email}`
    try {
        const data = await fetch(path)
        const response = await data.json()

        if (response.status === 304) {
            alert(response.message)
            return false
        }
        if (email === null || email === '') {
            alert('Ingrese una correo')
            return false
        }
        return true
    } catch (error) {
        console.log(error)
        alert(error)
    }
}