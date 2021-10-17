document.getElementById('option-date').addEventListener('change', loadDashBoard)

async function loadDashBoard(e) {
    const option = e.target.value
    const path = `/api/managers/chartDashboard`

    try {
        if (option != 0) {
            const data = await fetch(path, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }, body: JSON.stringify({ option: option })
            })
            const response = await data.json()
            console.log(response)
            if (response.card12 || response.card34) dashBoardCards(response.card12, response.card34)
            if (response.bestSellingProduct) bestSellingProduct(response.bestSellingProduct)
            if (response.topSalesCustomer) topSalesCustomer(response.topSalesCustomer)
            if (response.salesRevenueChart) fullYearSalesChart(response.salesRevenueChart)
        }
    } catch (error) {
        if (error) console.log(error)
        alert(error)
    }
}

function dashBoardCards(card12, card34) {
    const cards = document.querySelectorAll('.dashboard-cards')

    cards[0].innerText = card12[0].totalsales
    cards[1].innerText = "$ " + card12[0].revenue
    cards[2].innerText = "$ " + card34[0].cost
    cards[3].innerText = "$ " + card34[0].profit
}

let doughnutChart
function bestSellingProduct(product) {
    var ctx = document.getElementById('best-selling-product')

    let labels = []
    let products = []
    let backgroundColors = []
    const color = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"]

    for (let i = 0; i < product.length; i++) {
        labels.push(product[i].name)
        products.push(product[i].quantity)
        backgroundColors.push(color[i])
    }

    if (doughnutChart) {
        doughnutChart.destroy()
    }
    doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Platillo mas vendido',
                data: products,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'left'
                }
            }
        }
    })
}

function topSalesCustomer(customers) {
    const customersTopList = document.getElementById('top-customers-list')

    customersTopList.innerHTML = ''
    customers.map((customer, i) => {
        const tr = document.createElement('tr')
        tr.classList.add('text-center')
        const content = `
            <td>${i + 1}</td>
            <td>${customer.fullname}</td>
            <td>${customer.quantity}</td>
            <td>$ ${customer.expense}</td>
        `

        tr.innerHTML = content
        customersTopList.append(tr)
    })
}

let lineChart
function fullYearSalesChart(months) {
    var ctx = document.getElementById('year-sales')

    let monthLabels = []
    for (let i = 0; i < months.length; i++) {
        const date = new Date(months[i].date).toLocaleTimeString()
        monthLabels.push(date)
    }

    let monthsTotal = []
    for (let i=0; i < months.length; i++) {
        monthsTotal.push(months[i].total)
    }

    if (lineChart) {
        lineChart.destroy()
    }
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Ventas mensuales del año',
                data: monthsTotal
            }]
        }
    })
}