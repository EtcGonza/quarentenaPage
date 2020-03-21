////////////////////////////////////////////////////////////////////////////
// Promesa que muestra nombres de usuarios
let promesaUsuarios = new Promise((resolve, reject) => {
    // Realizo el fetch y en caso de que se realize correctamente 
    // guardo la respuesta en consulta.
    const consulta = fetch('https://jsonplaceholder.typicode.com/users').then(data => {
        return data;
    }).catch(error => {
        // Utilizo el reject en caso de que tenga un error con la respuesta.
        reject(error);
    });

    // La respuesta del fect la convierto la paso por el .json() para obtener los usuarios.
    consulta.then(data => {
        resolve(data.json());
    }).catch(error => {
        // Utilizo el reject en caso de que tenga un error con el .json()
        reject(error);
    });
});

promesaUsuarios.then(respuesta => {
    console.log('La promesa se resolvio correctamente: ', respuesta);
}).catch(error => {
    console.log('La promesa no se resolvio correctamente: ', error);
});

////////////////////////////////////////////////////////////////////////////
// Funcion asincrona para usuarios.

async function getUsuarios(paramUrl) {
    // Realizo fetch y guardo la respuesta en consulta.
    const consulta = await fetch(paramUrl);

    // La respuesta del fetch la paso por el .json() para sacar los usuarios.
    const dataJson = await consulta.json();

    // Muestro mis usuarios
    // console.log('Mis usuarios: ', dataJson);
    return dataJson;
}

getUsuarios('https://jsonplaceholder.typicode.com/users');

//////////////////////////////////////////////////////////////////////////// 
async function getUsuariosValidos() {
    // Utilizo la funcion getUsuarios que hice antes para obtener una arreglo de usuarios
    // y guardo ese arreglo en usuarios.
    const arrayUsuarios = await getUsuarios('https://jsonplaceholder.typicode.com/users');
    console.log('ArrayUsuarios ', arrayUsuarios);

    // Arreglo que va a tener los userNames de los usuarios que tengo en 'arrayUsuarios'
    var arrayUserNames = [];

    // Hago un for donde defino una variable 'contador' que empiza en 0 que ira aumentando.
    // el bucle termina cuando el contador sea mayor que la longitud del arreglo de usuarios.
    for (let contador = 0; contador < arrayUsuarios.length; contador++) {
        // Ingresa a las posicion del arreglo 'arrayUsuarios' con la variable contador
        // y tomo el userName del objeto al que accedi.
        // Y ese objeto lo inserto en el arreglo 'arrayUserNames'.
        arrayUserNames.push(arrayUsuarios[contador].username);
    }

    // Arreglo que va a tener objetos. Y cada objeto va a tener dos objetos mas dentro, uno seran los datos del mismo y el otro los usuarios que lo siguen.
    var arrayUsuariosValidos = [];

    // Variable para llevar una cuenta de los usuarios que no se pudieron recuperar sus datos.
    let usuariosErrores = 0;


    // For que funciona exactamente igual que el anterior.
    for (let contador = 0; contador < arrayUserNames.length; contador++) {
        // Por cada usuario del arreglo de 'arrayUserNames' hago una consulta para traerme sus datos de Github.
        const consultaUsuario = await fetch('https://api.github.com/users/' + arrayUserNames[contador]);

        // Por cada usuario del arreglo de 'arrayUserNames' hago una consulta para traerme sus followers de Github.
        const consultaFollowers = await fetch('https://api.github.com/users/' + arrayUserNames[contador] + '/followers');

        // Si la respuesta de la consulta para usuario y para followers fue exitosa entonces
        // puedo pasar las dos respuesta por el .json() para conseguir la informacion.
        if (consultaUsuario.ok && consultaFollowers.ok) {
            const usuarioJson = await consultaUsuario.json();
            const followersJson = await consultaFollowers.json();

            // Defino un objeto 'gitHubUsuario'
            // Que tiene dos objetos, uno con los datos del usuario
            // y otro con los followers del usuario.
            const gitHubUsuario = {
                datosUsuarios: usuarioJson,
                seguidoresUsuario: followersJson
            };

            // Inserto el objeto 'gitHubUsuario' en el arreglo de'arrayUsuariosValidos'
            arrayUsuariosValidos.push(gitHubUsuario);
        } else {
            // Si entre aca significa que alguna de las dos consulta, consultaUsuario o consultaFollowers, no fue 'OK'
            // Sumo uno a la variable 'usuariosErrores'.
            usuariosErrores++;
        }
    }

    // Muestro cuantos usuarios tenia para buscar y cuantos tuvieron errores en las consultas.
    console.log('De ', arrayUserNames.length, ' usuarios que teniamos ', usuariosErrores, ' tuvieron errores y no se pudo recuperar sus datos');
    // Muestro mis usuarios de Github con sus datos y seguidores.
    console.log('Mis Usuarios Validos: ', arrayUsuariosValidos);

}

getUsuariosValidos();