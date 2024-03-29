// CONST


const containerDeProductos = document.querySelector('#containerDeProductos');;
const containerCarrito = document.querySelector('#containerCarrito');
const vaciarCarrito = document.querySelector('#vaciarCarrito')
const img_cart = document.getElementById("img-carrito");
const pagar = document.querySelector('#pagar');
const pagar_save = document.querySelector('#pagar_save');
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })


// GET & CREATE 

let obj = {
    cant: 0
}

let titulo = document.getElementById("titulo");
let mensaje = document.getElementById("mensaje");
let compra = document.getElementById("compra");

let inputCompra = document.createElement("input");
let parrafo = document.createElement("p");

let formulario = document.getElementById("formulario");
let boton = document.createElement("button");
let boton_2 = document.getElementById("proceso")

boton_2.style.display = "none";
img_cart.style.display = "none";
titulo.style.color = "grey";
inputCompra.style.display = "none";
pagar_save.style.display = "none";
pagar.style.display = "none";

// ARRAYS
let lista_productos = [];
let lista_productos_ext = [];
let carrito = [];
let totalCarro = [];
let totalCarroSave = [];
let carritoSave = [];
let sum = 0;


// CONSTRUCTOR
class Alcoholes {
    constructor({
        marca,
        nombre,
        precio,
        id,
        stock,
        img,
        cant
    }) {
        this.marca = marca
        this.nombre = nombre
        this.precio = precio
        this.id = id
        this.stock = stock
        this.img = img
        this.cant = cant

    }
    total() {
        totalCarro.push(this.precio*obj.cant); 
        totalCarroSave.push(this.precio*obj.cant)
    }
    resta(){
        totalCarro.push(-(this.precio*obj.cant))
        
    }
    

}

const request = async () => {
    try{
        const response = await fetch('productos.json');
        const data = await response.json();
        data.forEach(element => {
            lista_productos_ext.push(new Alcoholes(element))
        });
    }
    
    catch(error){
    }
}
request()



let boton2 = document.getElementById("boton2");
let boton3 = document.getElementById("boton3");
boton3.addEventListener("click", set_data );
boton2.addEventListener('click', recuperar);



function set_data(){


    let name = document.getElementById("nombre");
    let age = document.getElementById("edad");

    sessionStorage.setItem("name", name.value);
    sessionStorage.setItem("age", age.value);



    
}

function borrarLocalStorage(){
    localStorage.removeItem("carrito_json");
}


function recuperar(){
    
    let name = document.getElementById("nombre");
    let age = document.getElementById("edad");

    name.value = sessionStorage.getItem("name");
    age.value = sessionStorage.getItem("age");

}
// FUNCIONES
function valido_edad(){
    let edad = document.getElementById("edad");
    let nombre = document.getElementById("nombre");
    if (nombre.value == ""){
        parrafo.innerText = "Por favor, inserte un nombre antes de ingresar";
    }
    else{
    if(edad.value >= 18){
        boton2.style.display = "none";
        boton3.style.display = "none";
        inputCompra.placeholder = "Ingrese la cantidad";
        inputCompra.style.textAlign = "center";
        inputCompra.style.backgroundColor = "black";
        inputCompra.style.color = "red";
        compra.append(inputCompra);
        parrafo.innerText = `\nBienvenido/a a la Tienda ${nombre.value}`

            plantillas(lista_productos_ext)
            formulario.style.display = "none";
            titulo.style.display = "none";
        
        mensaje.append(parrafo);
        parrafo.style.fontFamily = "Verdana";
        parrafo.style.fontSize = "25px";
        parrafo.style.textAlign = "center";
        parrafo.style.color = "grey";
        recuCarrito()
        
    }
    else if (edad.value < 18) {
        if (edad.value < 15){
            parrafo.innerText   = "Por favor, ingrese una edad superior a 15 años";
            mensaje.append(parrafo);
            parrafo.style.fontFamily = "Verdana";
            parrafo.style.fontSize = "25px";
            parrafo.style.textAlign = "center";
            parrafo.style.color = "orange";
        }
        else{
        parrafo.innerText = "No sos mayor, proximamente sección para infantiles.";
        mensaje.append(parrafo);
        parrafo.style.fontFamily = "Verdana";
        parrafo.style.fontSize = "25px";
        parrafo.style.textAlign = "center";
        parrafo.style.color = "red";
        }
    }
}
}

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('button')){
       if (obj.cant <= 0){

            alert("Por favor, ingrese una cantidad mayor a 0")
       }
       else{
        img_cart.style.display = "inline";
        addCarrito(e.target.id)
        }
    }
})

function saveCarrito(){
    carrito.forEach(elm => {

        let productosGuardar = {marca: elm.marca, nombre: elm.nombre, precio: elm.precio, id: elm.id, stock: elm.stock, img: elm.img, cant: elm.cant}
        carritoSave.push(productosGuardar);
        let carrito_json = JSON.stringify(carritoSave);
        localStorage.setItem("carrito_json", carrito_json);
            })
}


function recuCarrito(){
    let carritoGuardado = localStorage.getItem("carrito_json");
    carritoGuardado = JSON.parse(carritoGuardado);
    if (carritoGuardado != null){
    img_cart.style.display = "inline";
    carritoGuardado.forEach(elm => {
           
            carrito.push(elm);
            })
        renderCarrito() // LISTO
        totalCarritoSave(carritoGuardado)
}
    else {
        console.log("No quedaron productos guardados")
    }
    }





function addCarrito(id){

            carritoSave = [];
            let existe = false
           
           
           let productoEncontrado = lista_productos_ext.filter(elm => elm.id == id)
                carrito.forEach(prod => {
                        if (prod.id == productoEncontrado[0].id){
                        existe = true

                        }
                    }); 
               
                   if (existe == false) {
                    carrito.push({marca: productoEncontrado[0].marca, nombre: productoEncontrado[0].nombre, precio: productoEncontrado[0].precio, id: productoEncontrado[0].id, stock: productoEncontrado[0].stock, img: productoEncontrado[0].img, cant:obj.cant})           
                    productoEncontrado[0].total()
                    totalCarrito()
                    renderCarrito()
                    saveCarrito()

                   }
                   else if (existe == true){
                    obj.cant = parseInt(obj.cant)
                    carrito.forEach(elemento => {
                        elemento.cant = parseInt(elemento.cant)
                        elemento.cant = elemento.cant + obj.cant
                        productoEncontrado[0].total()
                        totalCarrito()
                        renderCarrito()
                        saveCarrito()
                    });
                   }
                   
                   
                  
                  
                   
       

   

   
}




function totalCarrito() {
    let precios = totalCarro.reduce((a,b) => a + b)
    
    if (Math.sign(precios) == true){
    document.querySelector('#precio').innerHTML = `Total $${precios}`
    }
    else {
        document.querySelector('#precio').innerHTML = `Total $${0}`
    }
    
}


function totalCarritoSave(carritoGuardado){

    for (let i = 0; i < carritoGuardado.length; i++) {
    sum += carritoGuardado[i].precio*carritoGuardado[i].cant;
    }
    totalCarro.push(sum);
    document.querySelector('#precio').innerHTML = `Total $${sum}`
}

function renderCarrito(){
    pagar_save.style.display = "none";
    pagar.style.display = "inline";
    containerCarrito.innerHTML = ""
    carrito.forEach(elm => {
        containerCarrito.innerHTML += `
        <th>${elm.nombre}</th>
        <th>${elm.precio}</th>
        <th class="btnEliminar" data-id="${elm.id}">X</th>
        <th>${elm.cant}</th>
        `
    })
}

function plantillas(lista_productos_ext) {
    containerDeProductos.innerHTML = ""
    
    lista_productos_ext.forEach(elm => {
    
        containerDeProductos.innerHTML += `
        
        <div class="card">
        <div class="card-img"<p class="text-title"></div><img src="./${elm.img}"  alt="imagen" class="tamaño"/>
        
        <div class="card-info">
          <p class="text-title"> ${elm.marca}  ${elm.nombre} </p>
        </div> 
        <div class="card-input">
        <input id="inputCantidades" class="inputCantidades" type="number" min="1" placeholder="cant">  
          <p class="text-title"></p>
        </div> 
        <div class="card-footer">
        <span class="text-title">$${elm.precio}</span>
        <div class="card-button">
          <button id="${elm.id}" class="button">Agregar</button>
        </div>
        
      </div>
       
    
     </div>
        `

        // LISTO INPUT! 
    })



    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('inputCantidades')) {
            let cantidadComprada = e.target.value
           obj.cant = cantidadComprada

        }
    })

pagar.addEventListener('click', (e) =>{
    pagar_save.style.display = "none";
    e.preventDefault()
    if (totalCarro.length == 0) {
        console.log("No tienes productos para pagar");
    }
    else {  
        pagar_first()
    
}
})

pagar_save.addEventListener('click', (e) =>{
    pagar.style.display = "none";
    e.preventDefault()
    if (carritoSave.length == 0) {
        console.log("No tienes productos para pagar, ya compraste.")
    }
    else {
        pagarSave()
        }
        
})


document.addEventListener('click', (e) => {
        if(e.target.classList.contains('btnEliminar')){
            eliminarProducto(e.target.dataset.id)
            console.log('eliminado');
        }
    } )

function pagar_first(){
        Swal.fire({
            title: "Metodo de Pago",
            text: "¿Desea pagar en efectivo o tarjeta?",
            input: 'text',
            showCancelButton: true        
        }).then((result) => {
            let precios = totalCarro.reduce((a,b) => a + b)
            result.value = result.value.toLowerCase()
            if (result.value == "efectivo") {
                swalWithBootstrapButtons.fire(
                    'Pago aceptado',
                    'Pagaste en efectivo un total de: $'+precios,
                    'success'
                  )
                carrito.forEach(elm => {
                    update_stock(elm, elm.cant);
                })
                document.querySelector('#precio').innerText = "Total $0"
                reset_carrito()
                borrarLocalStorage()
            }
            else if (result.value == "tarjeta"){
                Swal.fire({
                    title: "Cuotas",
                    text: "Perfecto, abonas con tarjeta, elija las cuotas (3/6/9)",
                    input: 'text',
                    showCancelButton: true        
                }).then((cuotas) => {
                    if (cuotas.value) {
                        cuotas.value = parseInt(cuotas.value);
                        precio_cuotas(cuotas.value, precios);
                        carritoSave.forEach(elm => {
                            update_stock(elm, elm.cant);
                        })
                        document.querySelector('#precio').innerText = "Total $0"
                        reset_carrito()
                        borrarLocalStorage()
                    }
                });
            }
            else {
                swalWithBootstrapButtons.fire(
                    'Error',    
                    'Por favor, elija un metodo de pago',
                    'error'
                  )
            }
        });
    }    

function eliminarProducto(id){

    console.log(id);

    let item = carrito.find(elm => elm.id == id)
        
        if (item.cant == 1){            
            totalCarro.push(-(item.precio*item.cant)) 
            totalCarrito()

            let index = carrito.indexOf(item)
            carrito.splice(index, 1) 

            renderCarrito() 
        }else {
                let item = carrito.find(elm => elm.id == id)
                item.cant -= 1
               
                totalCarro.push(-(item.precio)) 
          
                totalCarrito()
                renderCarrito()
                
           
            totalCarrito()
            renderCarrito() 
        }

    
    }



     

function precio_cuotas(cantCuotas, precios){
        if (cantCuotas === 3){ 
            let porcentaje_3 = (precios*15/100); // EL INTERES 15 %
            let precio_final = precios + porcentaje_3;
            alertaCuotas(precio_final, cantCuotas);


    }
        else if(cantCuotas === 6){
            let porcentaje_6 = (precios*35/100); // EL INTERES 35 %
            let precio_final = precios + porcentaje_6;
            alertaCuotas(precio_final, cantCuotas);
    }
        else if(cantCuotas === 9){
            let porcentaje_9 = (precios*50/100); // EL INTERES 50 %
            let precio_final = precios + porcentaje_9;
            alertaCuotas(precio_final, cantCuotas);
    }
}


function update_stock(elm,cant){

    elm.stock = elm.stock -cant;
    console.log("El nuevo stock de: ", elm.nombre, "es", elm.stock);

    }

function alertaCuotas(precio_final, cantCuotas){
    swalWithBootstrapButtons.fire(
        'Pago aceptado',
        'Pagaste en ' +  cantCuotas + ' cuotas'  + ' un total de: $'+ precio_final,
        'success'
      )
}

function pagarSave (){
    Swal.fire({
        title: "Metodo de Pago",
        text: "¿Desea pagar en efectivo o tarjeta?",
        input: 'text',
        showCancelButton: true        
    }).then((result) => {
        result.value = result.value.toLowerCase()
        if (result.value == "efectivo") {
            swalWithBootstrapButtons.fire(
                'Pago aceptado',
                'Pagaste en efectivo un total de: $'+sum,
                'success'
              )
            carritoSave[0].forEach(elm => {
                update_stock(elm, elm.cant);
            })
            document.querySelector('#precio').innerText = "Total $0"
            reset_carrito()
            borrarLocalStorage()
        }
        else if (result.value == "tarjeta"){
            Swal.fire({
                title: "Cuotas",
                text: "Perfecto, abonas con tarjeta, elija las cuotas (3/6/9)",
                input: 'text',
                showCancelButton: true        
            }).then((cuotas) => {
                if (cuotas.value) {
                    cuotas.value = parseInt(cuotas.value);
                    precio_cuotas(cuotas.value, sum);
                    carritoSave[0].forEach(elm => {
                        update_stock(elm, elm.cant);
                    })
                    document.querySelector('#precio').innerText = "Total $0"
                    reset_carrito()
                    borrarLocalStorage()
                }
            });
        }
        else {
            swalWithBootstrapButtons.fire(
                'Error',
                'Por favor, elija un metodo de pago',
                'error'
              )
        }
    });
}

 function reset_carrito () {
    
        carrito = [];
        carritoSave = [];
        totalCarro = [];
        renderCarrito();
        document.querySelector('#precio').innerText = "Total $0";
    }

    
vaciarCarrito.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#precio').innerText = "Total $0";
        borrarLocalStorage()
        carrito = []
        carritoSave = [];
        totalCarro = []
        renderCarrito() 
    } )
    
}
