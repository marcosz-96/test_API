const url = "https://api.restful-api.dev/objects";

window.onload = function(){
    $("#popUp").hide()
    getObjects()
}

// Creamos las PROMESAS que utilizaremos 
// Verificamos el correcto funcionamiento de la red

function loadObjects(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest()
        request.open("GET", url)
        request.responseType = "json"
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response)
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function(){
            reject(Error("Error: unexpected network error."))
        }
        request.send()
    })
}

// Función para agregar Objetos a la lista

function addObject(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest()
        request.open("POST", url)
        request.setRequestHeader("Content-Type", "application/json")
        const data = JSON.stringify({
            'surname': document.getElementById('surname').value, 
            'age': document.getElementById('age').value,
            'email': document.getElementById('email').value
        })
        const object = JSON.stringify({
            'name': document.getElementById('name').value,
            'data': data
        })
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response)
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function(){
            reject(Error("Error: unexpected network error."))
        }
        request.send(object)
    })
}

// Función para eliminar Objetos de las lista, por id

function removeObject(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest()
        request.open('DELETE', url + `/${id}`)
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response)
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function(){
            reject(Error("Error: unexpected network error."))
        } 
        request.send()
    })
}

// Función para modificar Objetos de la lista, por id

function modifyObject(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest()
        request.open('PUT', url + `/${document.getElementsByName('id2')[0].value}`)
        request.setRequestHeader('Content-Type', 'application/json')
        const data = JSON.stringify({
            'surname': document.getElementById('surname').value, 
            'age': document.getElementById('age').value,
            'email': document.getElementById('email').value
        })
        const object = JSON.stringify({
            'name': document.getElementById('name').value,
            'data': data
        })
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response)
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function(){
            reject(Error('Error: unexpected network error.'))
        }
        request.send(object)
    })
}

// Creamos las funciones que consumen las PROMESAS 
// Función para llamar a los Objetos

function getObjects(){
    loadObjects().then(response => {
        const tbody = document.querySelector('tbody')
        tbody.innerHTML = ''
        response.forEach(object => {
            if(object.data !== null && Object.hasOwn(object.data, 'name') && Object.hasOwn(object.data, 'surname') && Object.hasOwn(object.data, 'email')){
                insertTr(object, false)
            }  
        })
    }).catch(reason =>{
        console.error(reason)
    })
}

// Función para guardar un Objetos

function saveObjects(){
    if(document.getElementById('name').value.trim() !== '' &&
        document.getElementById('surname').value.trim() !== '' &&
        document.getElementById('age').value.trim() !== '' && 
        document.getElementById('email').value.trim() !== ''){
        addObject().then((response) =>{
            const object = JSON.parse(response)
            const data = JSON.parse(object.data)
            object.data = data
            insertTr(object, true)
        }).catch(reason =>{
            console.error(reason)
        })
    }
}

// Función para eliminar un Objeto

function deleteObject(object){
    removeObject(object.id).then(()=>{
        const rows = document.querySelector('tr')
        rows.forEach(row => {
            if(row.getAttribute('id') === object.id){
                row.remove()
                clearInputs()
            }
        })
    }).catch(reason => {
        console.error(reason)
    })
}