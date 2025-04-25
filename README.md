# test_API: 

## Trabajo Práctico

_Se debe realizar una aplicación web con contenido dinámico en las que se manipulen los registros obtenidos desde una aplicación externa._

- Se deberá consumir la siguiente APi:  **"https://api.restful-api.dev/objects"** 

#### Los EndPoints que se van a utilizar son: 

- (GET) student/getAll
  - (POST) student/add
    - (POST) student/{id}/update
      - (POST) student/{id}/delete
  
_Cada EndPoint realizará una acción distinta. Para ello se utilizaran ```tags``` y ```scripts```_

Las funciones van a ser:

- 1. Obtener y mostrar un listado de todos los estudiantes.
- 2. Cargar todos los datos y agregar nuevos estudiantes.
- 3. En la misma funcón se deberá poder modificar y eliminar datos de los estudiantes.  


**_Alumno: Gomez Marco_**