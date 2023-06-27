let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector('.cart')
let closeCart= document.querySelector('#close-cart')

cartIcon.onclick = () => {
    cart.classList.add("active")
}

closeCart.onclick = () => {
    cart.classList.remove("active")
}

if (document.readyState=="loading") {
    document.addEventListener("DOMContentLoaded", ready)    
} else {
    ready()
}

function ready() {
     var removeCartButtons = document.getElementsByClassName("cart-remove")
     for (let index = 0; index < removeCartButtons.length; index++) {
        var button = removeCartButtons[index]
        button.addEventListener("click", removeCartItem)
     }

     var quantityInputs = document.getElementsByClassName("cart-quantity")
     for (let index = 0; index < quantityInputs.length; index++) {
        var input = quantityInputs[index]
        input.addEventListener("change", qunatityChanged)  
     }
     //

     var addCart =  document.getElementsByClassName("add-cart")
     for (let index = 0; index < addCart.length; index++) {
        var button = addCart[index];
        button.addEventListener("click", addCartClicked)
    } 
    updateTotal()
    loadCartItem()
}

function removeCartItem(event) {    
    var buttonClicked = event.target
    buttonClicked.parentElement.remove()
    updateTotal()
    saveCartItems()   
    updateCartIcon() 
}
 
function qunatityChanged(event) {
    var input = event.target
    if (isNaN(input.value)||input.value  <= 0) {
        input.value = 1
    }
    updateTotal()
    saveCartItems()
    updateCartIcon() 
}

function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText
    var price = shopProducts.getElementsByClassName('price')[0].innerText
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src
    addProductToCart(title,price,productImg)
    updateTotal()
    saveCartItems()   
    updateCartIcon() 
}

function addProductToCart(title,price,productImg) {
    var cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-box')
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-product-title')
    for (let index = 0; index < cartItemNames.length; index++) {
       if (cartItemNames[index].innerText==title) {
            alert("You have already added this item to cart") 
            return
       }
    }
    var cartBoxContent =`<img src="${productImg}" alt="" srcset="" class="cart-img"/>
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" name="" value="1" class="cart-quantity" id="">
    </div>
    <i class='bx bx-trash-alt cart-remove'></i>`
    cartShopBox.innerHTML = cartBoxContent
    cartItems.append(cartShopBox)
    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener('click', removeCartItem)
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", qunatityChanged)

    updateTotal()
    saveCartItems()
    updateCartIcon() 
}

function updateTotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0]
    var cartBoxs = cartContent.getElementsByClassName("cart-box")    
    var total = 0
    for (let index = 0; index < cartBoxs.length; index++) {
        var cartBox = cartBoxs[index]
        var priceElement = cartBox.getElementsByClassName("cart-price")[0]
       
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0]
        var price = parseFloat(priceElement.innerText.replace('$',''))
        var quantity = quantityElement.value
        total += price * quantity
        
    }
    total = Math.round(total*100)/100
    document.getElementsByClassName("total-price")[0].innerText = "$"+total

    localStorage.setItem("cartTotal", total)
}

function saveCartItems() {
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var cartItems = []

    for (let index = 0; index < cartBoxes.length; index++) {
        var carbox = cartBoxes[index];
        var titleElement = carbox.getElementsByClassName('cart-product-title')[0]
        var priceElement = cart.getElementsByClassName('cart-price')[0]
        var quantityElement = carbox.getElementsByClassName('cart-quantity')[0]
        var productImg = carbox.getElementsByClassName('cart-img')[0].src
        console.log(quantityElement.value)
        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity:quantityElement.value,
            productImg: productImg
        }
    cartItems.push(item)
    console.log(item)
    }
    localStorage.setItem("cartItems",JSON.stringify(cartItems))
}

function loadCartItem() {
    var cartItems = localStorage.getItem("cartItems")
    if (cartItems) {
        cartItems = JSON.parse(cartItems)
        for (let index = 0; index < cartItems.length; index++) {
            var item = cartItems[index];
            addProductToCart(item.title,item.price,item.productImg)

            var cartBoxes = document.getElementsByClassName('cart-box')
            var carbox = cartBoxes[cartBoxes.length-1]
            var quantityElement = carbox.getElementsByClassName('cart-quantity')[0]
            quantityElement.value = item.quantity            
        }

        var cartTotal = localStorage.getItem('cartTotal')
        if (cartTotal) {
            document.getElementsByClassName('total-price')[0].innertText = "$"+ cartTotal
        }
    }
    updateCartIcon() 
}   

function updateCartIcon() {
    var cartBoxs = document.getElementsByClassName('cart-box')
    var quantity = 0
    
    for (let index = 0; index < cartBoxs.length; index++) {
        var carbox = cartBoxs[index];
        var quantityElement = carbox.getElementsByClassName("cart-quantity")[0]
        quantity += parseInt(quantityElement.value)        
    }
    var cartIcon = document.querySelector("#cart-icon")
    cartIcon.setAttribute("data-quantity",quantity)
}