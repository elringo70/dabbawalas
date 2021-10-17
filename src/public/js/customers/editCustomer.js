let states
let cities
let municipalities
//Listeners

//Remove more than 10 characters
document.getElementById('phone').addEventListener('keyup', function (e) {
    if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 10);
    }
})

document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const submit = document.querySelector('.submit')

    if (submit.dataset.submit === 'false') {
        return formReset(submit)
    }

    if (submit.dataset.submit === 'true') {
        const phone = document.getElementById('phone')
        await formValidation(phone.value)
    }
})

document.getElementById('cancel-button').addEventListener('click', (e) => {
    window.location.reload();
})

//Functions
function formReset(target) {
    const cancelButton = document.getElementById('cancel-button')

    if (target.value.toUpperCase() === 'EDITAR' && target.type === 'submit') {
        target.value = 'Guardar'
        target.type = 'submit'
        target.classList.remove('btn-secondary')
        target.classList.add('btn-primary')
        cancelButton.classList.remove('disabled')
        if (target.hasAttribute('data-submit')) {
            target.setAttribute('data-submit', true)
        } else {
            console.log('Modificación no permitida')
            return window.alert('Modificación no permitida')
        }

        const disabled = document.querySelectorAll('.disabled')
        disabled.forEach(item => {
            if (item.getAttribute('id') !== 'phone') {
                item.disabled = false
            }
        })
    }

    const disabled = document.querySelectorAll('.disabled')
    disabled.forEach(input => {
        if (!input.disabled === false) return input.disabled.false
    })
}

async function formValidation() {
    const confirmation = window.confirm('¿Esta seguro de realizar los cambios al cliente?')
    const phone = document.getElementById('phone').value

    if (confirmation) {
        const path = `http://localhost:3000/api/customers/editCustomerByRestaurant/${phone}`

        const formData = new URLSearchParams();
        for (const pair of new FormData(form)) {
            formData.append(pair[0], pair[1]);
        }

        try {
            if (confirmation) {
                const response = await fetch(path, {
                    method: 'PATCH',
                    body: formData
                })

                const data = await response.json()
                switch (data.status) {
                    case 201:
                        sendInputAlert(data.message, 'alert-success', 'phoneExistsAlert')
                        const disabled = document.querySelectorAll('.disabled')
                        disabled.forEach(item => {
                            if (item.getAttribute('id') !== 'phone') {
                                item.disabled = false
                            }
                        })
                        break;
                    case 304:
                        sendInputAlert(data.message, 'alert-danger', 'phoneExistsAlert')
                        break;
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

function resetSelect() {
    const citySelect = document.getElementById('city-select')
    while (citySelect.options.length > 0) {
        citySelect.options.remove(0)
    }

    const option1 = document.createElement('option')
    option1.text = 'Seleccione una ciudad'
    citySelect.add(option1)

    const municipalitySelect = document.getElementById('municipality-select')
    while (municipalitySelect.options.length > 0) {
        municipalitySelect.options.remove(0)
    }

    const option2 = document.createElement('option')
    option2.text = 'Selecciona una colonia'
    municipalitySelect.add(option2)
}

async function loadStates() {
    states = []

    const path = `/api/addresses/getAllStates`

    try {
        const data = await fetch(path)
        const response = await data.json()
        states = response
    } catch (error) {
        console.log(error)
        window.alert(error)
    }

}

function renderStates() {
    const selectStates = document.getElementById('state-select')

    for (let i = 0; i < states.length; i++) {
        const option = document.createElement('option')
        option.value = states[i].id
        option.text = states[i].nombre
        selectStates.add(option)
    }
}

function renderCities() {
    const citySelect = document.getElementById('city-select')

    while (citySelect.options.length > 0) {
        citySelect.options.remove(0)
    }

    for (let i = 0; i < cities.length; i++) {
        const option = document.createElement('option')
        option.value = cities[i].id
        option.text = cities[i].nombre
        option.classList.add('option-cities')
        citySelect.add(option)
    }
}

function renderMunicipalities() {
    const municipalitySelect = document.getElementById('municipality-select')

    while (municipalitySelect.options.length > 0) {
        municipalitySelect.options.remove(0)
    }

    for (let i = 0; i < municipalities.length; i++) {
        const option = document.createElement('option')
        option.value = municipalities[i].id
        option.text = municipalities[i].nombre
        option.classList.add('option-municipalities')
        municipalitySelect.add(option)
    }
}

async function loadCities(state) {
    cities = []

    const path = `/api/addresses/getAllCitiesFromState/${state}`

    try {
        const data = await fetch(path)
        const response = await data.json()

        cities = response
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
}

async function loadMunicipalities(city) {
    municipalities = []
    const path = `/api/addresses/getAllMunicipalitiesFromCity/${city}`

    try {
        const data = await fetch(path)
        const response = await data.json()

        municipalities = response
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
}

async function loadEntities() {
    const stateId = `{{customer.id_state}}`
    const cityId = `{{customer.id_city}}`
    const municipalityId = `{{customer.id_municipality}}`

    const selectStates = document.getElementById('state-select')
    for (let i = 0; i < states.length; i++) {
        const option = document.createElement('option')
        option.value = states[i].id
        option.text = states[i].nombre
        if (states[i].id == stateId) {
            option.setAttribute('selected', true)
        }
        selectStates.add(option)
    }

    await loadCities(stateId)
    const citySelect = document.getElementById('city-select')

    for (let i = 0; i < cities.length; i++) {
        const option = document.createElement('option')
        option.value = cities[i].id
        option.text = cities[i].nombre
        option.classList.add('option-cities')
        if (cities[i].id == cityId) {
            option.setAttribute('selected', true)
        }
        citySelect.add(option)
    }

    await loadMunicipalities(cityId)
    const municipalitySelect = document.getElementById('municipality-select')

    for (let i = 0; i < municipalities.length; i++) {
        const option = document.createElement('option')
        option.value = municipalities[i].id
        option.text = municipalities[i].nombre
        option.classList.add('option-municipalities')
        if (municipalities[i].id == municipalityId) {
            option.setAttribute('selected', true)
        }
        municipalitySelect.add(option)
    }
}

addEventListener('load', async () => {
    await loadStates()
    await loadEntities()

    document.getElementById('state-select').addEventListener('change', async (e) => {
        const state = e.target.value
        const municipalitySelect = document.getElementById('municipality-select')

        while (municipalitySelect.options.length > 0) {
            municipalitySelect.options.remove(0)
        }
        const option = document.createElement('option')
        option.text = 'Seleccione una colonia'
        municipalitySelect.add(option)

        await loadCities(state)
        renderCities()

        document.getElementById('city-select').addEventListener('change', async (e) => {
            const municipality = e.target.value

            await loadMunicipalities(municipality)
            renderMunicipalities()
        })
    })
})