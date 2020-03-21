let selectHeading = document.querySelector('.heading');
selectHeading.innerHTML = 'Quarentena sucks';

var nuevoItem = document.createElement('li');
nuevoItem.innerHTML = 'Item 5';
nuevoItem.classList.add('item');

var selectUl = document.querySelector('ul');
selectUl.appendChild(nuevoItem);

function cambiarImagen() {
    setTimeout(() => {
        var selectImage = document.getElementById('heading_image');
        selectImage.setAttribute('src', 'https://cdn.pixabay.com/photo/2020/03/15/15/41/medical-4934010_960_720.jpg');
    }, 2000);
}

cambiarImagen();

cargarUsuariosGithubDinamica(10);

async function cargarUsuariosGithub() {
    // Me traigo solamente dos usuarios con datos.
    const usuarios = await getUsuarios('http://jsonplaceholder.typicode.com/users?_limit=2');

    // De los dos usuarios que me traje antes me traigo sus datos de GitHub.
    // asi puedo insertar sus avatars y sus nombres.
    const usuario1 = await getUserGithub(usuarios[0].username);
    const usuario2 = await getUserGithub(usuarios[1].username);

    // Me traigo dos arrays, uno con las imagenes y otro con los parrafos.
    var imagenes = document.querySelectorAll('.contenedorImagenes img');
    var parrafos = document.querySelectorAll('.contenedorImagenes p');

    // Inserto en las imagenes los avatars de los usuarios de GitHub.
    imagenes[0].setAttribute('src', usuario1.avatar_url);
    imagenes[1].setAttribute('src', usuario2.avatar_url);

    // Inserto en los parrafos el nombre de los usuarios de GitHub.
    parrafos[0].innerHTML = usuario1.name;
    parrafos[1].innerHTML = usuario2.name;
}

async function cargarUsuariosGithubDinamica(cantidadUsuarios) {
    const usuarios = await getUsuarios(`http://jsonplaceholder.typicode.com/users?_limit=${cantidadUsuarios}`);
    const contenedorImagenes = document.querySelector('.contenedorImagenes');

    for (let contador = 0; contador < cantidadUsuarios; contador++) {
        let usuario = await getUserGithub(usuarios[contador].username);

        if (!usuario.message) {
            var nuevoDiv = document.createElement('div');

            var nuevaImg = document.createElement('img');
            nuevaImg.setAttribute('src', usuario.avatar_url);

            var nuevoParrafo = document.createElement('p');
            nuevoParrafo.innerHTML = usuario.name;

            nuevoDiv.appendChild(nuevaImg);
            nuevoDiv.appendChild(nuevoParrafo);

            contenedorImagenes.appendChild(nuevoDiv);
        } else {
            console.log('Error: no se pudo los datos de GitHub del usuario.', usuarios);
        }

    }
}

async function getUsuarios(paramUrl) {
    const consulta = await fetch(paramUrl);
    if (consulta.ok) {
        const dataJson = await consulta.json();
        return dataJson;
    }
}

async function getUserGithub(usuarioName) {
    const consulta = await fetch('https://api.github.com/users/' + usuarioName);
    const userData = await consulta.json();
    return userData;
}