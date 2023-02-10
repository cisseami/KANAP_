const orderId = getOrderId()
postOrderId(orderId)
clearStorage()


function getOrderId(){
    const querySting = window.location.search
    const urlParams = new URLSearchParams(querySting)
    const orderId = urlParams.get("orderId")
    return orderId
}

function postOrderId(orderId){
    const orderIdElement = document.querySelector("#orderId")
    orderIdElement.textContent = orderId
}

function clearStorage() {
    const cache = window.localStorage
    cache.clear()
}