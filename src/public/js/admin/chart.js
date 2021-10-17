let dataObject = []

document.getElementById('form').addEventListener('submit', loadData)

async function loadData(e) {
    e.preventDefault()

    const path = `/api/admin/postLoadRestaurantData`
    const formData = new URLSearchParams()

    for (const pair of new FormData(form)) {
        formData.append(pair[0], pair[1]);
    }

    try {
        const data = await fetch(path, {
            method: 'POST',
            body: formData
        })
        const response = await data.json()

        if (response.status === 304) {
            return window.alert(response.message)
        }

        const downloadButton = document.querySelector('.download-btn')
        downloadButton.disabled = false
        renderRestaurantData(response)
        timePeriodRevenue(response)
        timePeriodChart(response)
    } catch (error) {
        console.log(error)
        window.alert(error)
    }
}

async function renderRestaurantData(response) {
    const processing = document.querySelector('.processing-orders')
    const completed = document.querySelector('.completed-orders')
    const canceled = document.querySelector('.canceled-orders')

    const cards = response.ordersSummary

    if (
        cards.opened == null ||
        cards.completed == null ||
        cards.canceled == null
    ) {
        processing.innerHTML = 0
        completed.innerHTML = 0
        canceled.innerHTML = 0
    } else {
        processing.innerHTML = cards.opened
        completed.innerHTML = cards.completed
        canceled.innerHTML = cards.canceled
    }
}

function timePeriodChart(response) {
    const chart = response.chartObject
    console.log(chart)
    var ctx = document.querySelector('.chart')
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chart.dataLabels,
            datasets: [{
                label: 'Time period sales',
                data: chart.data
            }]
        }
    })
}


function timePeriodRevenue(response) {
    const product = response.product
    const productName = document.querySelector('.selling-product')
    const productQuantity = document.querySelector('.selling-product-quantity')
    const productImage = document.getElementById('selling-product-image')

    productName.innerHTML = product.productName
    productQuantity.innerHTML = product.quantity
    productImage.src = '/' + product.productImage
    productImage.classList.add('img-thumbnail')
}

