let states
let cities
let municipalities
//Listeners
//Functions
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

addEventListener('load', async () => {
    await loadStates()
    renderStates()

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