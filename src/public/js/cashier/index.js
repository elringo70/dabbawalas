document.getElementById('form').addEventListener('submit', formValidation)
document.getElementById('email').addEventListener('change', emailValidation)
document.getElementById('pass').addEventListener('change', passValidation)
document.getElementById('dob').addEventListener('change', dobValidation)
document.getElementById('confpass').addEventListener('change', passwordConfirmation)
addEventListener('load', dateInputRestriction)

async function formValidation(e) {
    e.preventDefault()

    const emailVal = await emailValidation()
    const passVal = passValidation()
    const dobVal = dobValidation()
    const passConfVal = passwordConfirmation()

    try {
        const path = `/api/managers/postNewCashier`
        const formData = new URLSearchParams();

        if (
            emailVal
            && passVal
            && dobVal
            && passConfVal
        ) {
            for (const pair of new FormData(form)) {
                formData.append(pair[0], pair[1]);
            }

            const data = await fetch(path, {
                method: 'POST',
                body: formData
            })
            const response = await data.json()

            if (response.status === 304) {
                return sendInputAlert(response.message, 'alert-danger', 'emailAlert')
            }
            form.reset()
        }
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
}

async function emailValidation() {
    const email = document.getElementById('email').value

    if (email === null || email === '') {
        sendInputAlert('Ingrese un correo electrónico', 'alert-danger', 'emailAlert')
        return false
    }

    const path = `/api/getUserByEmail/${email}`

    try {
        const data = await fetch(path)
        const response = await data.json()

        if (response.status === 304) {
            sendInputAlert(response.message, 'alert-danger', 'emailAlert')
            return false
        }

        return true
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
}

function dobValidation() {
    const emailAlert = document.getElementById('emailAlert')
    const dateInput = document.getElementById('dob').value
    const date = new Date(dateInput)
    const actualYear = new Date().getFullYear()

    if ((actualYear - 18) < date.getFullYear()) {
        sendInputAlert('Debe de ser mayor de edad para registrarse', 'alert-danger', 'emailAlert')
        return false
    } else if (emailAlert.style.display === 'block' && (actualYear - 18) > date.getFullYear()) {
        emailAlert.style.display = 'none'
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

function passValidation() {
    const pass = document.getElementById('pass').value
    pass.trim()

    const format = /[a-zA-Z]+([(@!#\$%\^\&*\)\(+=._-]{1,})?/

    const includesCharacters = format.test(pass)

    if (pass.length < 6) {
        sendInputAlert('Debe de contener al menos 6 caracteres', 'alert-danger', 'emailAlert')
        return false
    } else if (!includesCharacters) {
        sendInputAlert('La contraseña debe de contener algun caracter especial', 'alert-danger', 'emailAlert')
        return false
    }
    return true
}

function passwordConfirmation() {
    const pass = document.getElementById('pass').value
    const confpass = document.getElementById('confpass').value

    document.getElementById('confpass').addEventListener('change', function (element) {
        const emailAlert = document.getElementById(alert)
        if (emailAlert != null) {
            emailAlert.remove()
        }
    })

    if (pass != confpass) {
        sendInputAlert('Las contraseñas no coinciden', 'alert-danger', 'emailAlert')
        return false
    } else {
        return true
    }
}