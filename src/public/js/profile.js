const fullName = document.querySelector('#fullName');
const formProfile = document.querySelector('#formProfile');

getProfile();

async function getProfile() {
    const response = await fetch('http://localhost:8080/api/users/profile').then(res => res.json());
    const data = response.payload;

    fullName.innerHTML = `${data.firstName} ${data.lastName}`;
    formProfile.children[0].children[1].value = data.email;
    formProfile.children[1].children[1].value = data.age;
    formProfile.children[2].children[1].value = data.firstName;
    formProfile.children[3].children[1].value = data.lastName;
}