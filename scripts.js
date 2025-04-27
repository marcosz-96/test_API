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
// Se crea una variable para almacenar los IDs
// y se incrementen automáticamente a medida que se agregan datos

let currentId = 1; // contador de IDs

function addObject(){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");

        const object = {
            id: currentId++,
            name: document.getElementById('name').value,
            data: JSON.stringify({
                surname: document.getElementById('surname').value,
                age: document.getElementById('age').value,
                email: document.getElementById('email').value
            })
        }
        
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
        request.send(JSON.stringify(object)); // Envía el objeto con el ID
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

function modifyObject(modifiedObject){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        const id = modifiedObject.id;
        request.open('PUT', url + `/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');
        
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
        request.send(JSON.stringify(modifiedObject)); // Envía los datos modicados
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

                const id = parseInt(object.id)
                if(id >= currentId){
                    currentId = id + 1;
                }
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
    const id = object.id; // Obtiene el id del objeto
    removeObject(id).then(()=>{
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            if(row.getAttribute('id') === id){
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
    
    const id = document.getElementsByName('id2')[0].value;
    const modifiedObject = {
        id: id, // Modifica el objeto pero mantiene el ID existente
        name: document.getElementsByName('name2')[0].value,
        data: JSON.stringify({
            surname: document.getElementsByName('surname2')[0].value,
            age: document.getElementsByName('age2')[0].value,
            email: document.getElementsByName('email2')[0].value
        })
    };
    
        modifyObject(modifiedObject).then(()=>{
            const rows = document.querySelectorAll('tr');
            rows.forEach(row => {
                if(row.getAttribute('id') === id){
                    
                    row.children[1].innerHTML = modifiedObject.name;
                    const data = JSON.parse(modifiedObject.data);
                    row.children[2].innerHTML = data.surname;
                    row.children[3].innerHTML = data.age;
                    row.children[4].innerHTML = data.email;
                    
                    row.children[5].innerHTML = `<button onclick='updateObject(${modifiedObject})'>MODIFY</button>`;
                    row.children[6].innerHTML = `<button onclick='deleteObject(${modifiedObject})'>DELETE</button>`;
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
    const data = JSON.parse(object.data);
    row.insertCell().innerHTML = data.surname;
    row.insertCell().innerHTML = data.age;
    row.insertCell().innerHTML = data.email;
    
    if (canChange) {
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