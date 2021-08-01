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