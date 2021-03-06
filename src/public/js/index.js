function sendInputAlert(message, colorAlert, id) {
    const element = document.getElementById(id)
    const alert = `alert-${id}`
    element.innerHTML = `
        <div class="my-3" id="${alert}">
            <div class="alert ${colorAlert} alert-dismissible fade show" role="alert">
                <strong>${message}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    `
    return alert
}

//Fetch request
async function fetchRequest(path, method, body) {
    const response = await fetch(path, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })

    return response
}

//Validate every input that only contains letters
document.querySelectorAll('.input-text-validation').forEach(function (input, i) {
    input.addEventListener('change', function () {
        const node = input.nextElementSibling

        if (node.nodeName === 'SMALL') {
            const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g

            const inputValidation = regex.test(input.value)

            if (!inputValidation) {
                return node.removeAttribute('hidden')
            }

            if (inputValidation && node.getAttribute('hidden', true) === null) {
                return node.setAttribute('hidden', true)
            }
        }
    })
})

//Validate every input that only contains numbers
document.querySelectorAll('.input-number-validation').forEach(function (input, i) {
    input.addEventListener('change', function () {
        const node = input.nextElementSibling

        if (node.nodeName === 'SMALL') {
            const regex = /^\d*[1-9]\d*$/

            const inputValidation = regex.test(input.value)

            if (!inputValidation) {
                return node.removeAttribute('hidden')
            }

            if (inputValidation && node.getAttribute('hidden', true) === null) {
                return node.setAttribute('hidden', true)
            }
        }
    })
})

//Validate productName doesn't have more than 20 characteres
document.querySelectorAll('.input-name-product-validation').forEach(function (input, i) {
    input.addEventListener('change', function (e) {
        const node = input.nextElementSibling

        if (e.target.value.length === '') {
            node.innerHTML = 'Agregue el nombre del platillo'
            return node.removeAttribute('hidden')
        }

        if (node.nodeName === 'SMALL') {
            const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g

            const inputValidation = regex.test(input.value)

            if (!inputValidation) {
                return node.removeAttribute('hidden')
            }

            if (inputValidation && node.getAttribute('hidden', true) === null) {
                return node.setAttribute('hidden', true)
            }
        }

        if (e.target.value.length > 20) {
            node.innerHTML = 'Ingrese menos de 20 caracteres'
            node.removeAttribute('hidden')
        }
    })
})

//Modal popUp
function showModal(modalOBJ, className) {
    let input
    let modalHTML

    const previousModal = document.querySelector('.modal')
    if (previousModal !== null) {
        previousModal.remove()
    }

    if (className !== undefined) {
        input = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${modalOBJ.falseButton}</button>`
    } else {
        input = ''
        className = ''
    }
    console.log(className)
    console.log(input)

    modalHTML = document.createElement('div')
    modalHTML.innerHTML = `
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">${modalOBJ.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">${modalOBJ.message}</div>
                    <div class="modal-footer">
                        ${input}
                        <button type="button" class="btn btn-success ${className}" data-bs-dismiss="modal">${modalOBJ.trueButton}</button>
                    </div>
                </div>
            </div>
        </div>
    `

    document.body.append(modalHTML)
    const modal = new bootstrap.Modal(document.querySelector('#staticBackdrop'))
    modal.show()
}