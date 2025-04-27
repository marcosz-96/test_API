const url = "https://api.restful-api.dev/objects";

window.onload = function(){
    $('#popUp').hide()
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
            'surname': document.getElementById('surname2').value, 
            'age': document.getElementById('age2').value,
            'email': document.getElementById('email2').value
        })
        const object = JSON.stringify({
            'name': document.getElementById('name2').value,
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

// Función para Actualizar datos de un Objeto

function updateObject(){
    if(document.getElementById('name2')[0].value.trim() !== '' &&
    document.getElementById('surname2')[0].value.trim() !== '' &&
    document.getElementById('age2')[0].value.trim() !== '' &&
    document.getElementById('email2')[0].value.trim() !== ''){
        modifyObject().then(()=>{
            const rows = document.querySelectorAll('tr')
            rows.forEach(row => {
                if(row.getAttribute('id') === document.getElementsByName('id2')[0].value){
                    const data = JSON.stringify({
                        'surname': document.getElementsByName('surname2')[0].value,
                        'age': document.getElementsByName('age2')[0].value,
                        'email': document.getElementsByName('email2')[0].value
                    })
                    const object = JSON.stringify({
                        'id': document.getElementsByName('id2')[0].value,
                        'name': document.getElementsByName('name2')[0].value,
                        'data': data
                    })
                    row.childNodes[1].innerHTML = document.getElementsByName('name2')[0].value,
                    row.childNodes[2].innerHTML = document.getElementsByName('surname2')[0].value,
                    row.childNodes[3].innerHTML = document.getElementsByName('age2')[0].value,
                    row.childNodes[4].innerHTML = document.getElementsByName('email2')[0].value
                    
                    row.childNodes[5].innerHTML = `<button onclick='viewObject(${object})'>VIEW</button>`
                    row.childNodes[6].innerHTML = `<button onclick='updateObject(${object})'>MODIFY</button>`
                    row.childNodes[7].innerHTML = `<button onclick='deleteObject(${object})'>DELETE</button>`
                }
            })
            $('#popUp').dialog('close')
            clearInputs()
        }).catch(reason=>{
            console.error(reason)
        })
    }
}

// Funciones de Agregados

function insertTr(object, canChange){
    const tbody = document.querySelector('tbody')
    const row = tbody.insertRow()
    row.setAttribute('id', object.id)
    const id = row.insertCell()
    id.innerHTML = object.id
    const name = row.insertCell()
    name.innerHTML = object.name
    const surname = row.insertCell()
    surname.innerHTML = object.data.surname
    const age = row.insertCell()
    age.innerHTML = object.data.age
    const email = row.insertCell()
    email.innerHTML = object.data.email
    const data = JSON.stringify({
        'surname': object.data.surname,
        'age': object.data.age,
        'email': object.data.email
    })
    var object = JSON.stringify({
        'id': object.id,
        'name': object.name,
        'data': data
    })
    if (canChange) {
        const view = row.insertCell()
        view.innerHTML = `<button onclick='viewObject(${object})'>VIEW</button>`
        const modify = row.insertCell()
        modify.innerHTML = `<button onclick='modifyObject(${object})'>MODIFY</button>`
        const delet = row.insertCell()
        delet.innerHTML = `<button onclick='deleteObject(${object})'>DELETE</button>`
    }
    clearInputs()
}

// Función para Ver los Objetos

function viewObject(object){
    const data = JSON.parse(object.data)
    document.getElementsByName('id2')[0].value = object.id
    document.getElementsByName('name2')[0].value = object.name
    document.getElementsByName('surname2')[0].value = data.surname
    document.getElementsByName('age2')[0].value = data.age
    document.getElementsByName('email2')[0].value = data.email
    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '15px')
}

// Funcion para Vaciar los inputs despues de cargar datos

function clearInputs(){
    document.getElementById('name').value = ''
    document.getElementById('surname').value = ''
    document.getElementById('age').value = ''
    document.getElementById('email').value = ''
    document.getElementById('name').focus()
}