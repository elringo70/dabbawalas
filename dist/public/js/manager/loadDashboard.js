function renderOrders(orders) {
    const ordersList = document.querySelector('.orders-list')

    ordersList.innerHTML = ''
    orders.map(order => {
        const tr = document.createElement('tr')
        tr.setAttribute('data-order', order.id)
        tr.classList.add('text-center')

        const date = new Date(order.createdAt)
        const hour = date.toLocaleTimeString()

        const content = `
                <td>${order.id_order}</td>
                <td>${order.phone}</td>
                <td>${order.fullname}</td>
                <td>${hour}</td>
                <td>${order.orderstatus.toUpperCase()}</td>
                <td>$ ${order.total}</td>
            `

        tr.innerHTML = content
        ordersList.append(tr)
    })
}

function monthDataSales(response) {
    try {
        let labels = []
        for (let i = 0; i < response.length; i++) {
            labels[i] = response[i].day
        }

        let datasetData = []
        for (let i = 0; i < response.length; i++) {
            datasetData[i] = response[i].day_count
        }

        var ctx = document.getElementById('month-sales')
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Ventas del mes',
                    data: datasetData
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) { if (value % 1 === 0) { return value; } }
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}

async function render7DayChart(weekCount) {
    var ctx = document.getElementById('seven-day-chart')
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',],
            datasets: [{
                label: 'Ventas de la semana',
                data: weekCount
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (value % 1 === 0) { return value; } }
                    }
                }
            }
        }
    })
}

function fillDashBoardCards(cardsNames) {
    const cards = document.querySelectorAll('.dashboard-cards')

    cards.forEach(card => {
        switch (card.id) {
            case 'processing':
                card.innerHTML = cardsNames.processing
                break
            case 'completed':
                card.innerHTML = cardsNames.completed
                break
            case 'canceled':
                card.innerHTML = cardsNames.canceled
                break
            case 'delayed':
                card.innerHTML = cardsNames.delayed
                break
        }
    })
}

async function loadDashboard() {
    const path = `/api/orders/loadDashboard`
    try {
        const data = await fetch(path)
        const response = await data.json()

        console.log(response)

        if (response.daysCount) render7DayChart(response.daysCount)
        if (response.monthSales) monthDataSales(response.monthSales)
        if (response.lastSales) renderOrders(response.lastSales)
        if (response.ordersByStatus) fillDashBoardCards(response.ordersByStatus)
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}

addEventListener('load', loadDashboard)
