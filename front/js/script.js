const url = 'http://localhost:3000/api/products'


// Appel API

fetch(url)
  .then((response) => response.json())
  .then((data)=> addSofa(data))
  
// Fonction Principale avec toutes les fonctions inclus

function addSofa(data) {

 // Creation des objet avec toutes les donnee mentionne 

  data.forEach(sofa => {

    const _id = sofa._id
    const imageUrl = sofa.imageUrl 
    const altTxt = sofa.altTxt
    const name = sofa.name
    const description = sofa.description
    
    const link = addLink(_id)
    const article = document.createElement("article")
    const image = addImage(imageUrl, altTxt)
    const h3 = addName(name)
    const p = addDescription(description)

    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)  

    addItems(link, article)

  })

}

// selection du ID et ajoute dans le DOM

function addItems(link, article) {
  const items = document.querySelector("#items")
  if (items) {
    items.appendChild(link)
    link.appendChild(article)
  }
}


// lien a href

function addLink(_id) {
  const link = document.createElement("a")
  link.href = "./product.html?id=" + _id
  return link
}



// Creation Image 

function addImage(imageUrl, altTxt) {
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}

// Creation du titre H3

function addName(name) {
  const h3 = document.createElement("h3")
  h3.textContent = name  
  h3.classList.add("productName")
  return h3
}

// Creation de la description

function addDescription(description) {
  const p = document.createElement("p")
  p.textContent = description
  p.classList.add("productDescription")
  return p
}