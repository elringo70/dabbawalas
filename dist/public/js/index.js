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