let cart = []

retriveData()



const commander = document.querySelector("#order")
commander.addEventListener("click", (e) => submitForm(e))


// recuperation des donnes a partir du locale storage et de l'API

function retriveData(){
    const numberOfItems = localStorage.length 
    for(i = 0; i < numberOfItems; i++) {
        const quantity = localStorage.getItem(localStorage.key(i))
        const tab = localStorage.key(i).split(" ")
        const id = tab[0]
        const color = tab[1]

        fetch(`http://localhost:3000/api/products/${id}`)
        .then((Response) => Response.json())
        .then((itemObjet) => {
            itemObjet.quantity = Number(quantity)
            itemObjet.color = color
            itemObjet.id = id
            cart.push(itemObjet)
            basketItem(itemObjet)
        })
    }
}

// Function principale

function basketItem(item){
    const article = createArticle(item)
    addArticle(article)

    const image = addImage(item)
    article.appendChild(image)

    const section = sectionContent(item)
    article.appendChild(section)
    totalQuantity()
    totalPrice()
}





// inserer larticle dans la page html
function addArticle(article){
    document.querySelector("#cart__items").appendChild(article)
}



// Creation de l'article

function createArticle(item){
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}


// creation de l'image à partir du cache
function addImage(item){

    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt

    div.appendChild(image)

    return div
}




// deuxieme partie de la section description et parametre

function sectionContent(item){
    const div = document.createElement("div")
    div.classList.add("cart__item__content")

    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name

    const p = document.createElement("p")
    p.textContent = item.color

    const p2 = document.createElement("p")
    p2.textContent = Number(item.price) + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)

    div.appendChild(description)


    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")


    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
  
    const p3 = document.createElement("p")
    p3.textContent = "Qté :"
    
  
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"  
    input.value = item.quantity


    input.addEventListener("change", () => updatePriceAndQuantity( item.id, input.value, item)) 
  
    quantity.appendChild(p3)
    quantity.appendChild(input)
    
    
  
    div.appendChild(description)
    div.appendChild(settings)
  
    const cancel = document.createElement("div")
    cancel.classList.add("cart__item__content__settings__delete")

    
    cancel.addEventListener("click", () => deleteItem(item))
  
    const cancelItem = document.createElement("p")
  
    cancelItem.classList.add("deleteItem")
    cancelItem.textContent = "Supprimer"
    cancel.appendChild(cancelItem)
  
    
    settings.appendChild(quantity)
    settings.appendChild(cancel)


    return div

}



// prix total des articles du panier

function totalPrice(){
    let total = 0;
    const totalPrice = document.querySelector("#totalPrice")
    cart.forEach((item) => {
        const totalFinal = item.price * item.quantity
        total = total + totalFinal
    })
    totalPrice.textContent = total


}

// nombre total d'article dans le panier

function totalQuantity(){
    let total = 0;
    const totalQuantity = document.querySelector("#totalQuantity")
    cart.forEach((item => {
        const totalFinal =  item.quantity
        total = total + totalFinal
    }))
    totalQuantity.textContent = total
}


// function principale du changement de la quantite et du prix total finale dans le panier

function updatePriceAndQuantity(id, newValue, item){ 
    const itemToUpdate = cart.find((element) => element.id === item.id && element.color === item.color)
    itemToUpdate.quantity = Number(newValue)

    totalPrice()
    totalQuantity()
    storageData(item)

}



// enregistrements modification quantite dans le locale storage ainsi que dans l'input

function storageData(item){
    localStorage.setItem(item.id + " "+ item.color, item.quantity)
}



// function principale de supprimer 

function deleteItem(item) {
    const itemToDelete = cart.findIndex(
        (product) => product.id === item.id 
    )
    cart.splice(itemToDelete, 1)
    totalPrice()
    totalQuantity()
    deleteData(item)
    deleteSection(item)
    
}

// supprimer la donne du locale storage

function deleteData(item) {
    const key = item.id + " "+ item.color
    localStorage.removeItem(key)
}


// function au click supprimer l'objet du panier

function deleteSection(item){
    const articleToDelete = document.querySelector (
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    articleToDelete.remove()
    
}








 
// function du bouton commander


function submitForm(e){
    e.preventDefault() // ne pas rafraichir l'evenement

    if (cart.length === 0) {
        alert("The basket is empty")
        return
    }

    if (validInput()) return
    
    
    const body = formData()

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            window.location.href = "../html/confirmation.html" + "?orderId=" + orderId
            return console.log(data)
        })
        .catch((err) => console.error(err)) // si il y a une erreur visuel rouge


    
}


// les donnees a envoyer a la base de donnee

function formData(){
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value

    const body = {
        contact : {
            firstName: firstName,
            lastName: lastName,
            address: address ,
            city : city,
            email: email,
    },

    products : productData()
    }
    return body
}


// recuperation des donnes du produits pour les envoyer a la base de donne 

function productData(item) {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0 ; i< numberOfProducts; i++) {
        const key = localStorage.key(i)
        const identity = key.split(" ")[0]
        ids.push(identity)

    }
    return ids
    
}

// Validation de l'ensemble des input 

function validInput(){
    if (checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail()) { 
        return false
    } 
    else  {
        return true
    }
}





// check input regex


function checkEmail(){
    const email = document.querySelector("#email").value
    let regexEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    const emailError = document.getElementById('emailErrorMsg');
    if ( regexEmail.test(email) === true ) {
        emailError.textContent = "";
        return true
        
    }
    emailError.textContent = "mail invalide";
    emailError.style.color ='red';
    return false
    
}


function checkFirstName(){
    const firstName = document.querySelector("#firstName").value
    let regexFirstName = new RegExp('[A-Za-z]');
    const firstNameError = document.getElementById('firstNameErrorMsg');
    if ( regexFirstName.test(firstName) === true ) {
        firstNameError.textContent = "";
        return true
        
    }
    firstNameError.textContent = "first name invalide";
    firstNameError.style.color ='red';
    return false

    
}



function checkLastName(){
    const lastName = document.querySelector("#lastName").value
    let regexLastName = new RegExp('[A-Za-z]');
    const lastNameError = document.getElementById('lastNameErrorMsg');
    if ( regexLastName.test(lastName) === true ) {
        lastNameError.textContent = "";
        return true
        
    }

    lastNameError.textContent = "lastname invalide";
    lastNameError.style.color ='red';
    return false
    
}

function checkAddress(){
    const address = document.querySelector("#address").value
    let regexAddress = new RegExp('[0-9a-zA-Z]');
    const addressError = document.getElementById('addressErrorMsg');
    if ( regexAddress.test(address) === true) {
        addressError.textContent = "";
        return true
        
    }
    addressError.textContent = "address invalide";
    addressError.style.color ='red';
    return false
   
}

function checkCity(){
    const city = document.querySelector("#city").value
    let regexCity = new RegExp('[A-Za-z]');
    const cityError = document.getElementById('cityErrorMsg');
    if ( regexCity.test(city) === true ) {
        cityError.textContent = "";
        return true
        
    }
    cityError.textContent = "city invalide";
    cityError.style.color ='red';
    return false
    
}