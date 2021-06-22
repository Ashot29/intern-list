const url = 'http://localhost:8000/interns';
const table = document.querySelector('.table');
const tbody = document.querySelector('.tbody');

let editing = true;

const addButton = document.querySelector('.add-button');
const cancelButton = document.querySelector('.cancel');
const saveButton = document.querySelector('.save');
const form = document.querySelector('.form');
console.log(table);

let currentUserId;
let currentUserTr;

const deleteMethod = {
    method: 'DELETE',
    headers: {
     'Content-type': 'application/json; charset=UTF-8'
    }
}

function getInternList(url) {
    fetch(url)
    .then(data => data.json())
    .then(response => tableRowMaker(response))
}

function tableRowMaker(response) {
    let objectKeys = Object.keys(response[0]);

    for (let i = 0; i < response.length; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < (objectKeys.length + 1); j++) {
            let td = document.createElement('td');
            let person = response[i];

            if (person[objectKeys[j]]) {
                td.textContent = person[objectKeys[j]];   
            } else {
                td.append(editButton(person));
                td.append(deleteButton(person.id));
            }

            tr.append(td);
        }
        tbody.append(tr)
    }
}

function editButton(person) {
    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.textContent = 'Edit';
    editButton.dataset.id = person.id;

    editButton.addEventListener('click', function(event) {
        showForm();
        currentUserId = editButton.dataset.id;
        currentUserTr = event.target.closest('tr');
        document.getElementById("name").value = person.name;
        document.getElementById("email").value = person.email;
        if (!editing) {
            editing = !editing
        }
    })

    return editButton
}
function dataDeleter(event) {
    let id = event.target.dataset.id
    let idUrl = url + `/${id}`;
    fetch(idUrl, deleteMethod)
        .then(() => {
            event.target.closest('tr').remove()
        })
}

function deleteButton(id) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.id = id;

    deleteButton.addEventListener('click', dataDeleter)

    return deleteButton
}

addButton.addEventListener('click', function() {
    showForm();
    if (editing) {
        editing = !editing
    }
});
cancelButton.addEventListener('click', closeForm);

saveButton.addEventListener('click', function(event) {
    if (!editing) {
        addingNewPerson() 
    } else {
        currentUserTr.remove();
        updatingPerson()
    }
    closeForm()
})

function addingNewPerson() {
    let user = createUser();
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(data => data.json())
      .then(response => {
        let obj = {
            id: response.id,
            name: response.name,
            email:response.email
        }
        tableRowMaker([obj]);
        console.log(obj, response)
      }) 
}

function updatingPerson() {
    let user = createUser();
    let newUrl = url + `/${currentUserId}`
    fetch(newUrl, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then(data => data.json())
        .then(response => {
        let obj = {
            id: response.id,
            name: response.name,
            email:response.email
        }
        tableRowMaker([obj]);
        console.log(obj, response)
        })
        .then(() => currentUserId = undefined)
}

function showForm() {
    if (form.style.display === '') {
        form.style.display = 'flex'
    }
}

function closeForm() {
    if (form.style.display = 'flex') {
        form.style.display = ''
    }
}

function createUser(id = '') {
    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
    };
    return user;
}

getInternList(url);