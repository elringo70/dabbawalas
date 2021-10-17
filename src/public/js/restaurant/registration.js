//onFocusOut check email if exists
document.getElementById('email').addEventListener('change', emailValidation)

//onFocusOut when entering password
document.getElementById('pass').addEventListener('change', passValidation)

//onFocusOut remove alert
document.getElementById('confpass').addEventListener('change', passwordConfirmation)

//Set Max date input
document.getElementById('dob').addEventListener('change', dobValidation)

//Submit validation
document.getElementById('form').addEventListener('submit', confirmCaptcha)

//Max age restriction
addEventListener('load', dateInputRestriction)

//Remove more than 10 digits
document.getElementById('phone').addEventListener('keyup', function (e) {
    if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 10);
    }
})

document.querySelectorAll('.change').forEach(element =>{
    const eventList = ['change', 'keydown', 'focus']
    for (let event of eventList) {
        element.addEventListener(event, function(e){
            const alert = document.getElementById('emailAlert')
            if (alert.childNodes.length > 0) {
                while (alert.firstElementChild) {
                    alert.removeChild(alert.firstElementChild)
                }
            }
        })
    }
})

//
//Functions
//

function passValidation() {
    const pass = document.getElementById('pass').value
    pass.trim()

    //const format = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
    const format = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$')

    const includesCharacters = format.test(pass)

    if (!includesCharacters) {
        alert('Debe incluir una mayuscula, minuscula, número y un caracter especial')
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

async function submitValidation(e) {
    e.preventDefault()

    const passValidation = passwordValidation()
    const dateValidation = dobValidation()
    const passConfirmation = passwordConfirmation()
    const emailConfirmation = await emailValidation()

    if (
        passValidation
        && dateValidation
        && passConfirmation
        && emailConfirmation
    ) {
        try {
            const path = `/api/managers/postNewManager`
            const formData = new URLSearchParams();

            for (const pair of new FormData(form)) {
                formData.append(pair[0], pair[1]);
            }

            try {
                const confirm = window.confirm('¿Desea seguir con el proceso de registro?')
                if (confirm) {
                    const data = await fetch(path, {
                        method: 'POST',
                        body: formData
                    })

                    const response = await data.json()

                    switch (response.status) {
                        case 201:
                            alert(`${response.message}. Espere autorización`)
                            form.reset()
                            grecaptcha.reset()
                            break;
                        case 304:
                            if (response.error) {
                                return sendInputAlert(response.error, 'alert-danger', 'dateAlert')
                            }
                            sendInputAlert(response.message, 'alert-danger', 'dateAlert')
                            break;
                    }
                }
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        sendInputAlert('Confirme todos los campos', 'alert-danger', 'emailAlert')
    }
}

function passwordValidation() {
    const pass = document.getElementById('pass').value
    const confpass = document.getElementById('confpass').value
    pass.trim()
    confpass.trim()

    const format = /[a-zA-Z]+([(@!#\$%\^\&*\)\(+=._-]{1,})?/
    const includesCharacters = format.test(pass)

    if (pass.length < 6) {
        sendInputAlert('Debe de contener al menos 6 caracteres', 'alert-danger', 'emailAlert')
        return false
    } else if (!includesCharacters) {
        sendInputAlert('La contraseña debe de contener algun caracter especial', 'alert-danger', 'emailAlert')
        return false
    } else {
        const confpass = document.getElementById('confpass').value
        confpass.trim()

        if (pass != confpass) {
            sendInputAlert('Las contraseñas no coinciden', 'alert-danger', 'emailAlert')
            return false
        } else {
            return true
        }
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
        sendInputAlert('Ingrese un correo electrónico', 'alert-danger', 'emailAlert')
        return false
    }

    const path = `/api/managers/getManagerByEmail/${email}`
    try {
        const data = await fetch(path)
        const response = await data.json()

        if (response.status === 200) {
            sendInputAlert(response.message, 'alert-danger', 'emailAlert')
            return false
        }
        if (email === null || email === '') {
            sendInputAlert('Ingrese una correo', 'alert-danger', 'emailAlert')
            return false
        }
        return true
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
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

async function confirmCaptcha(e) {
    e.preventDefault()

    const path = `/api/auth/confirmCaptcha`
    const captcha = document.querySelector('#g-recaptcha-response').value

    try {
        const data = await fetch(path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ captcha: captcha })
        })
        const response = await data.json()

        if (response.status === 200) {
            return submitValidation(e)
        }

        alert(response.message)
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}