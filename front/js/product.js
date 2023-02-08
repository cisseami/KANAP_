const querySting = window.location.search
const urlParams = new URLSearchParams(querySting)
const id = urlParams.get("id")


fetch(`http://localhost:3000/api/products/${id}`)
    .then((Response) => Response.json())
    .then((res) => addSofa(res))




// Fonction Principale

function addSofa(sofa){
   
    const imageUrl = sofa.imageUrl 
    const altTxt = sofa.altTxt
    const name = sofa.name
    const description = sofa.description
    const colors = sofa.colors
    const price = sofa.price

    
    addImage(imageUrl, altTxt)
    addTitle(name)
    addPrice(price)
    addDescription(description)
    addColors(colors)

}

// Creation Image 

function addImage(imageUrl, altTxt){
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent) parent.appendChild(image)
}


// Creation Nom

function addTitle(name){
    const h1 = document.querySelector("#title")
    if(h1) h1.textContent = name
}



// Creation Prix

function addPrice(price){
    const span = document.querySelector("#price")
    if(span) span.textContent = price
}



// Creation description

function addDescription(description){
    const p = document.querySelector("#description")
    if(p) p.textContent = description
}



// Creation deroulement couleurs 

function addColors(colors){
    const select = document.querySelector("#colors")
    if (select) {
        colors.forEach((color) => {
            const choice = document.createElement("option")
            choice.value = color
            choice.textContent = color
            select.appendChild(choice)
        })
    }
    
}



// selectionner le bouton dans le DOM et lui donner un eventListener

const button = document.querySelector("#addToCart")
button.addEventListener("click", basket)


// function principale d'action du bouton

function basket() {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value

    if (rightSelect(color, quantity)) return 
    storageAdd(color, quantity)
    loadCart()
}


//  parametre a remplir pour pouvoir ajouter au panier 

function rightSelect(color, quantity) {
    if (color == null || color == "" || quantity == null || quantity == 0) {
        alert ("Please select a color and quantity")
        return true
    }
    return false
}

// enregistrement cle valeurs locale storage


function storageAdd(color, quantity) {

    const data = {
        id : id,
        color : color,
        quantity : Number(quantity),
    }

    const product = parseInt(localStorage.getItem(data.id + " "+ data.color))

    if(product){
        let newQuantity = data.quantity + product
        localStorage.setItem(data.id + " "+ data.color, newQuantity)
    }
    else {
        localStorage.setItem(data.id + " "+ data.color, data.quantity)
    }

    
}


// redirection page panier

function loadCart() {
    window.location.href = "cart.html"
}

