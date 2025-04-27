const url = "https://api.restful-api.dev/objects";

window.onload = function(){
    $('#popUp').hide();
    getObjects();
}

// Creamos las PROMESAS que utilizaremos 
// Función para cargar datos desde la API

function loadObjects(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "json";
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response);
            }else{
                reject(Error(request.statusText));
            }
        };
        request.onerror = function(){
            reject(Error("Error: unexpected network error."));
        };
        request.send();
    });
}

// Función para agregar Objetos a la lista

function addObject(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");
        const data = JSON.stringify({
            'surname': document.getElementById('surname').value, 
            'age': document.getElementById('age').value,
            'email': document.getElementById('email').value
        });
        const object = JSON.stringify({
            'name': document.getElementById('name').value,
            'data': data
        });
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response);
            }else{
                reject(Error(request.statusText));
            }
        };
        request.onerror = function(){
            reject(Error("Error: unexpected network error."));
        };
        request.send(object);
    });
}

// Función para eliminar Objetos de las lista, por id

function removeObject(id){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        request.open('DELETE', url + `/${id}`);
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response);
            }else{
                reject(Error(request.statusText));
            }
        };
        request.onerror = function(){
            reject(Error("Error: unexpected network error."));
        };
        request.send();
    });
}

// Función para modificar Objetos de la lista, por id

function modifyObject(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        const id = document.getElementById('id2')[0].value;
        request.open('PUT', url + `/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');
        const data = JSON.stringify({
            'surname': document.getElementById('surname2').value, 
            'age': document.getElementById('age2').value,
            'email': document.getElementById('email2').value
        });
        const object = JSON.stringify({
            'name': document.getElementById('name2').value,
            'data': data
        });
        request.onload = function(){
            if(request.status === 200){
                resolve(request.response);
            }else{
                reject(Error(request.statusText));
            }
        };
        request.onerror = function(){
            reject(Error('Error: unexpected network error.'));
        };
        request.send(object);
    });
}

// Creamos las funciones que consumen las PROMESAS 
// Función para llamar a los Objetos

function getObjects(){
    loadObjects().then(response => {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        response.forEach(object => {
            if(object.data !== null && Object.hasOwn(object.data, 'name') && Object.hasOwn(object.data, 'surname') && Object.hasOwn(object.data, 'age') && Object.hasOwn(object.data, 'email')){
                insertTr(object, false)
            }  
        });
    }).catch(reason =>{
        console.error(reason);
    });
}

// Función para guardar un Objeto

function saveObjects(){
    if(document.getElementById('name').value.trim() !== '' &&
        document.getElementById('surname').value.trim() !== '' &&
        document.getElementById('age').value.trim() !== '' && 
        document.getElementById('email').value.trim() !== ''){
        addObject().then((response) =>{
            const object = JSON.parse(response);
            const data = JSON.parse(object.data);
            object.data = data;
            insertTr(object, true);
            alert("Datos ingresados exitosamente!");
        }).catch(reason =>{
            console.error(reason);
            alert("Error al tratar de ingresar datos.");
        });
    }else{
        alert("Debe completar los campos.");
    }
}

// Función para eliminar un Objeto

function deleteObject(object){
    removeObject(object.id).then(()=>{
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            if(row.getAttribute('id') === object.id){
                row.remove();
                clearInputs();
            }
        });
    }).catch(reason => {
        console.error(reason);
    });
}

// Función para Actualizar datos de un Objeto

function updateObject(){
    if(document.getElementById('name2').value.trim() !== '' &&
    document.getElementById('surname2').value.trim() !== '' &&
    document.getElementById('age2').value.trim() !== '' &&
    document.getElementById('email2').value.trim() !== ''){
        
        modifyObject().then(()=>{
            const rows = document.querySelectorAll('tr');
            rows.forEach(row => {
                if(row.getAttribute('id') === document.getElementById('id2').value){
                    const data = JSON.stringify({
                        'surname': document.getElementById('surname2').value,
                        'age': document.getElementById('age2').value,
                        'email': document.getElementById('email2').value
                    });
                    const objectData = JSON.stringify({
                        'id': document.getElementById('id2').value,
                        'name': document.getElementById('name2').value,
                        'data': data
                    });
                    row.children[1].innerHTML = document.getElementById('name2').value,
                    row.children[2].innerHTML = document.getElementById('surname2').value,
                    row.children[3].innerHTML = document.getElementById('age2').value,
                    row.children[4].innerHTML = document.getElementById('email2').value
                    
                    row.children[5].innerHTML = `<button onclick='viewObject(${objectData})'>VIEW</button>`;
                    row.children[6].innerHTML = `<button onclick='updateObject(${objectData})'>MODIFY</button>`;
                    row.children[7].innerHTML = `<button onclick='deleteObject(${objectData})'>DELETE</button>`;
                }
            });
            $('#popUp').dialog('close');
            clearInputs();
        }).catch(reason=>{
            console.error(reason);
        });
    }
}

// Funciones de Agregados

function insertTr(object, canChange){
    const tbody = document.querySelector('tbody');
    const row = tbody.insertRow();
    row.setAttribute('id', object.id);

    row.insertCell().innerHTML = object.id;
    row.insertCell().innerHTML = object.name;
    row.insertCell().innerHTML = object.data.surname;
    row.insertCell().innerHTML = object.data.age;
    row.insertCell().innerHTML = object.data.email;

    const data = JSON.stringify({
        'surname': object.data.surname,
        'age': object.data.age,
        'email': object.data.email
    });
    const objectData = JSON.stringify({
        'id': object.id,
        'name': object.name,
        'data': data
    });
    if (canChange) {
        row.insertCell().innerHTML = `<button onclick='viewObject(${objectData})'>VIEW</button>`;
        row.insertCell().innerHTML = `<button onclick='modifyObject(${objectData})'>MODIFY</button>`;
        row.insertCell().innerHTML = `<button onclick='deleteObject(${objectData})'>DELETE</button>`;
    }
    clearInputs();
}

// Función para Ver los Objetos

function viewObject(object){
    const data = JSON.parse(object.data)
    document.getElementById('id2').value = object.id;
    document.getElementById('name2').value = object.name;
    document.getElementById('surname2').value = data.surname;
    document.getElementById('age2').value = data.age;
    document.getElementById('email2').value = data.email;
    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '15px');
}

// Funcion para Vaciar los inputs despues de cargar datos

function clearInputs(){
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('age').value = '';
    document.getElementById('email').value = '';
    document.getElementById('name').focus();
}