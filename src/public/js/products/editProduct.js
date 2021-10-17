//Listeners
document.getElementById('form').addEventListener('submit', formValidation)

//Image listener
document.getElementById('formFile').addEventListener('change', loadImage)

//insertImage listener
document.getElementById('btnImageChangeButton').addEventListener('click', btnImageChangeButton)

//Functions
async function formValidation(e) {
    e.preventDefault()

    const formData = new FormData(form)
    const idProduct = document.getElementById('product-id').getAttribute('data-product')
    const path = `/api/products/editProductByIdByRestaurant/${idProduct}`

    try {
        const data = await fetch(path, {
            method: 'PATCH',
            body: formData
        })

        const response = await data.json()
        
        if (response.status === 304) return alert(response.message)
        if (response.status === 200) {
            form.reset()
            alert(response.message)
            window.location.reload()
        }
    } catch (error) {
        console.log(error)
    }
}

function priceValidation() {
    const cost = parseFloat(document.getElementById('cost').value, 10)
    const price = parseFloat(document.getElementById('price').value, 10)

    if (cost === 0 || price === 0) {
        sendInputAlert('El costo o precio no puede ser 0', 'alert-danger', 'priceAlert')
        return false
    }

    if (cost < 1 || price < 1) {
        sendInputAlert('El costo o precio no puede ser menor a 1', 'alert-danger', 'priceAlert')
        return false
    }

    if (price < cost) {
        sendInputAlert('El precio no puede ser menor al costo', 'alert-danger', 'priceAlert')
        return false
    }

    if (price > 499 || cost > 499) {
        sendInputAlert('El costo o precio de un producto no puede exceder de los $500', 'alert-danger', 'priceAlert')
        return false
    }

    if (price === cost) {
        sendInputAlert('El precio no puede ser igual al costo', 'alert-danger', 'priceAlert')
        return false
    }

    return true
}

//Load image from input file
function loadImage() {
    const preview = document.getElementById('loadedImg')
    const file = document.querySelector('input[type=file]').files[0]
    const reader = new FileReader()

    reader.onloadend = function () {
        preview.src = reader.result
    }

    if (file) {
        reader.readAsDataURL(file)
    } else {
        preview.src = ''
    }
}

function btnImageChangeButton() {
    const insertImage = document.getElementById('insertImage')
    const loadedImg = document.getElementById('loadedImg')
    const formFile = document.getElementById('formFile')

    insertImage.removeAttribute('hidden')
    loadedImg.removeAttribute('src')
    formFile.required = true
    formFile.disabled = false
}