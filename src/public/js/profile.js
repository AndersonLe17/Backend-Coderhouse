const fullName = document.querySelector('#fullName');
const formProfile = document.querySelector('#formProfile');
const formDocuments = document.querySelector('#formDocs');
const fileId = document.getElementById('idFile');
const fileDomicilio = document.getElementById('domicilioFile');
const fileCuenta = document.getElementById('cuentaFile');
const imgProfile = document.getElementById('imgProfile');
const btnUpdateProfile = document.getElementById('profileImage');
let uid;

getProfile();

async function getProfile() {
    const response = await fetch('http://localhost:8080/api/users/profile').then(res => res.json());
    const data = response.payload;

    fullName.innerHTML = `${data.firstName} ${data.lastName}`;
    formProfile.children[0].children[1].value = data.firstName;
    formProfile.children[1].children[1].value = data.lastName;
    formProfile.children[2].children[1].value = data.email;
    formProfile.children[3].children[1].value = data.age;
    formProfile.children[4].children[1].value = data.role;
    formProfile.children[5].children[1].value = data.status;
    imgProfile.src = data.profile || '/static/img/profile.png';

    uid = data._id;
}

formDocuments.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = getDocFormData();

    const response = await fetch(`http://localhost:8080/api/users/${uid}/documents`, {
        method: 'POST',
        body: formData
    }).then(res => res.json());
    if (response.payload) {
        getProfile();  
    }
});

btnUpdateProfile.addEventListener('change', async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    const response = await fetch(`http://localhost:8080/api/users/${uid}/profile`, {
        method: 'POST',
        body: formData
    }).then(res => res.json());
    if (response.payload) {
        getProfile();  
    }
});

function getDocFormData() {
    const formData = new FormData();
    fileId.files[0] && formData.append('files', fileId.files[0], "Identificación.pdf");
    fileDomicilio.files[0] && formData.append('files', fileDomicilio.files[0], "Comprobante de domicilio.pdf");
    fileCuenta.files[0] && formData.append('files', fileCuenta.files[0], "Comprobante de estado de cuenta.pdf");

    return formData;
}