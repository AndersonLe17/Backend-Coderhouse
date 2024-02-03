const fullName = document.querySelector('#fullName');
const formProfile = document.querySelector('#formProfile');
const formDocuments = document.querySelector('#formDocs');
const fileId = document.getElementById('idFile');
const fileDomicilio = document.getElementById('domicilioFile');
const fileCuenta = document.getElementById('cuentaFile');
let uid;

getProfile();

async function getProfile() {
    const response = await fetch('http://localhost:8080/api/users/profile').then(res => res.json());
    const data = response.payload;

    fullName.innerHTML = `${data.firstName} ${data.lastName}`;
    formProfile.children[0].children[1].value = data.email;
    formProfile.children[1].children[1].value = data.age;
    formProfile.children[2].children[1].value = data.firstName;
    formProfile.children[3].children[1].value = data.lastName;
    uid = data._id;
}

formDocuments.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = getDocFormData();

    const response = await fetch(`http://localhost:8080/api/users/${uid}/documents`, {
        method: 'POST',
        body: formData
    }).then(res => res.json());
});

function getDocFormData() {
    const formData = new FormData();
    fileId.files[0] && formData.append('files', fileId.files[0], "Identificación.pdf");
    fileDomicilio.files[0] && formData.append('files', fileDomicilio.files[0], "Comprobante de domicilio.pdf");
    fileCuenta.files[0] && formData.append('files', fileCuenta.files[0], "Comprobante de estado de cuenta.pdf");

    return formData;
}