const url = "https://api.restful-api.dev/objects";

window.onload = function() {
    $('#popUp').hide();
    getObjects();
}

let existingIds = new Set(); // Conjunto para almacenar IDs existentes

function loadObjects() {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.onload = () => {
            if (request.status === 200) {
                const response = JSON.parse(request.response);
                existingIds.clear();
                response.forEach(object => {
                    if (object.data !== null && Object.hasOwn(object.data, 'name') && Object.hasOwn(object.data, 'surname') && Object.hasOwn(object.data, 'age') && Object.hasOwn(object.data, 'email')) {
                        existingIds.add(object.id);
                    }
                });
                resolve(response);
            } else {
                reject(Error(request.statusText));
            }
        };
        request.onerror = () => {
            reject(Error("Error: unexpected network error."));
        };
        request.send();
    });
}

// Función para agregar Objetos a la lista

function addObject(newObject) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");

        const id = document.getElementById('id').value.trim();

        if (existingIds.has(id)) {
            alert("El ID ya existe. Por favor, ingrese uno nuevo.");
            return;
        }

        newObject = {
            id: id,
            name: document.getElementById('name').value,
            data: JSON.stringify({
                surname: document.getElementById('surname').value,
                age: document.getElementById('age').value,
                email: document.getElementById('email').value
            })
        };

        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error("Error: unexpected network error."));
        };
        request.send(JSON.stringify(newObject));
    });
}

// Función para eliminar Objetos de las lista, por id

function removeObject(id) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('DELETE', url + `/${id}`);
        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error("Error: unexpected network error."));
        };
        request.send();
    });
}

// Función para modificar Objetos de la lista, por id

function modifyObject(modifiedObject) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        const id = modifiedObject.id;
        request.open('PUT', url + `/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error('Error: unexpected network error.'));
        };
        request.send(JSON.stringify(modifiedObject));
    });
}

// Creamos las funciones que consumen las PROMESAS 
// Función para llamar a los Objetos

function getObjects() {
    loadObjects().then(response => {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        existingIds.clear();
        response.forEach(object => {
            if (object.data !== null && Object.hasOwn(object.data, 'name') && Object.hasOwn(object.data, 'surname') && Object.hasOwn(object.data, 'age') && Object.hasOwn(object.data, 'email')) {
                insertTr(object, false);
                existingIds.add(object.id);
            }
        });
    }).catch(reason => {
        console.error(reason);
    });
}


// Función para guardar un Objeto

function saveObjects() {
    const id = document.getElementById('id').value.trim();
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const age = document.getElementById('age').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validamos que los campos estén completos
    if (!id || !name || !surname || !age || !email) {
        alert("Complete todos los campos.");
        return; // Sale si hay campos vacíos
    }

    // Verifica si ya existe el ID
    if (existingIds.has(id)) {
        alert("El ID ya existe. Ingrese uno nuevo.");
        return;
    }

    // Creamos un nuevo objeto
    const newObject = {
        id: id,
        name: name,
        data: JSON.stringify({
            surname: surname,
            age: age,
            email: email
        })
    };

    // Llamamos la función para agregarlo a la lista
    addObject(newObject).then(() => {
        clearInputs();
        getObjects();
    }).catch(error => {
        console.error("Error al agregar los datos.", error);
    });
}

// Función para eliminar un Objeto

function deleteObject(object) {
    const id = object.id; // Obtiene el id del objeto
    if (!existingIds.has(id)) {
        alert("El ID no existe. Verifica que exista el ID.");
        return;
    }
    removeObject(id).then(() => {
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.getAttribute('id') === id) {
                row.remove();
                clearInputs();
            }
        });
    }).catch(reason => {
        console.error(reason);
    });
}

// Función para Actualizar datos de un Objeto

function updateObject() {
    const id = document.getElementsByName('id2')[0].value.trim(); // Obtiene el ID del campo de entrada
    if (!existingIds.has(id)) {
        alert("El ID no existe. Verifica que exista el ID.");
        return;
    }

    if (document.getElementsByName('name2')[0].value.trim() !== '' &&
        document.getElementsByName('surname2')[0].value.trim() !== '' &&
        document.getElementsByName('age2')[0].value.trim() !== '' &&
        document.getElementsByName('email2')[0].value.trim() !== '') {

        const modifiedObject = {
            id: id, // Mantiene el ID existente
            name: document.getElementsByName('name2')[0].value,
            data: JSON.stringify({
                surname: document.getElementsByName('surname2')[0].value,
                age: document.getElementsByName('age2')[0].value,
                email: document.getElementsByName('email2')[0].value
            })
        };

        modifyObject(modifiedObject).then(() => {
            const rows = document.querySelectorAll('tr');
            rows.forEach(row => {
                if (row.getAttribute('id') === id) {
                    row.children[1].innerHTML = modifiedObject.name;
                    const data = JSON.parse(modifiedObject.data);
                    row.children[2].innerHTML = data.surname;
                    row.children[3].innerHTML = data.age;
                    row.children[4].innerHTML = data.email;

                    row.children[5].innerHTML = `<button onclick='viewObject(${JSON.stringify(modifiedObject)})'>VIEW</button>`;
                    row.children[6].innerHTML = `<button onclick='updateObject()'>MODIFY</button>`;
                    row.children[7].innerHTML = `<button onclick='deleteObject(${JSON.stringify(modifiedObject)})'>DELETE</button>`;
                }
            });
            $('#popUp').dialog('close');
            clearInputs();
        }).catch(reason => {
            console.error(reason);
        });
    } else {
        alert("Debe completar los campos antes de poder actualizarlos");
    }
}

// Funciones de Agregados

function insertTr(object, canChange) {
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
        row.insertCell().innerHTML = `<button onclick='viewObject(${JSON.stringify(object)})'>VIEW</button>`;
        row.insertCell().innerHTML = `<button onclick='updateObject()'>MODIFY</button>`;
        row.insertCell().innerHTML = `<button onclick='deleteObject(${JSON.stringify(object)})'>DELETE</button>`;
    }
    clearInputs();
}

// Función para Ver los Objetos

function viewObject(object) {
    document.getElementsByName('id2')[0].value = object.id;
    document.getElementsByName('name2')[0].value = object.name;

    const data = JSON.parse(object.data);
    document.getElementsByName('surname2')[0].value = data.surname;
    document.getElementsByName('age2')[0].value = data.age;
    document.getElementsByName('email2')[0].value = data.email;

    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '15px');
}

// Función para Vaciar los inputs después de cargar datos
function clearInputs() {
    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('age').value = '';
    document.getElementById('email').value = '';

    // Se limpian los campos de la ventana emergente
    document.getElementsByName('id2')[0].value = '';
    document.getElementsByName('name2')[0].value = '';
    document.getElementsByName('surname2')[0].value = '';
    document.getElementsByName('age2')[0].value = '';
    document.getElementsByName('email2')[0].value = '';

    // Establecemos el punto de entrada en el campo ID
    document.getElementById('id').focus();
}