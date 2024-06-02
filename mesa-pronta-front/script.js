const API_URL = 'http://localhost:8000/api.php';
let isAdmin = false;
let editingMesaId = null;

document.addEventListener('DOMContentLoaded', function () {
    setupModals();
    checkUserStatus();

    const loginModalForm = document.getElementById('loginModalForm');
    if (loginModalForm) {
        loginModalForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('modalUsername').value;
            const password = document.getElementById('modalPassword').value;
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });
            const result = await response.json();
            if (result.success) {
                isAdmin = true;
                localStorage.setItem('isAdmin', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Login falhou');
            }
        });
    }
});

async function checkUserStatus() {
    isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        document.getElementById('addMesaButton').style.display = 'block';
        document.getElementById('tabelaMesas').style.display = 'table';
        exibirMesasAdmin();
    } else {
        document.getElementById('clienteMesas').style.display = 'table';
        exibirMesasCliente();
    }
}

async function exibirMesasAdmin() {
    const tbody = document.getElementById('tabelaMesas').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpa a tabela

    const response = await fetch(API_URL);
    const mesas = await response.json();

    mesas.forEach((mesa) => {
        let row = tbody.insertRow();
        row.insertCell(0).innerText = mesa.id;
        row.insertCell(1).innerText = mesa.coordenadas;
        row.insertCell(2).innerText = mesa.status;
        row.insertCell(3).innerText = mesa.nome ? mesa.nome : 'N/A';
        row.insertCell(4).innerHTML = `
            <button onclick="abrirEditarMesaModal(${mesa.id}, '${mesa.coordenadas}', '${mesa.nome || ''}')">Editar</button>
            <button onclick="alterarStatusMesa(${mesa.id}, '${mesa.status}')">${mesa.status === 'Disponível' ? 'Reservar' : 'Liberar'}</button>
            <button onclick="removerMesa(${mesa.id})">Remover Mesa</button>`;
    });
}

async function exibirMesasCliente() {
    const tbody = document.getElementById('clienteMesas').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';  // Limpa qualquer conteúdo existente

    const response = await fetch(API_URL);
    const mesas = await response.json();

    mesas.forEach((mesa) => {
        let row = tbody.insertRow();  // Cria uma nova linha
        row.insertCell(0).innerText = mesa.id;  // ID da mesa
        row.insertCell(1).innerText = mesa.coordenadas;  // Coordenadas
        row.insertCell(2).innerText = mesa.status;  // Status da reserva
        row.insertCell(3).innerText = mesa.nome ? mesa.nome : 'N/A';  // Nome do cliente
        row.insertCell(4).innerHTML = `<button onclick="abrirModal(${mesa.id})">Reservar</button>`;  // Botão de ação
    });
}

async function reservarMesa(index) {
    const nome = document.getElementById('nomeReserva').value.trim();
    if (nome) {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: index, nome: nome })
        });
        const result = await response.json();
        console.log(result);
        document.getElementById('modalReserva').style.display = 'none';
        exibirMesasAdmin();
        exibirMesasCliente();
    } else {
        alert("Por favor, insira um nome para fazer a reserva.");
    }
}

async function removerMesa(index) {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: index })
    });
    const result = await response.json();
    console.log(result);
    exibirMesasAdmin();
    exibirMesasCliente();
}

async function alterarStatusMesa(index, status) {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: index, status: status })
    });
    const result = await response.json();
    console.log(result);
    exibirMesasAdmin();
}

function setupModals() {
    var reservaModal = document.getElementById("modalReserva");
    var addMesaModal = document.getElementById("addMesaModal");
    var loginModal = document.getElementById("loginModal");

    var reservaSpan = document.getElementsByClassName("close")[0];
    var addMesaSpan = document.getElementsByClassName("close")[1];
    var loginSpan = document.getElementsByClassName("close")[2];

    reservaSpan.onclick = function() {
        reservaModal.style.display = "none";
    };
    addMesaSpan.onclick = function() {
        addMesaModal.style.display = "none";
    };
    loginSpan.onclick = function() {
        loginModal.style.display = "none";
    };
    
    window.onclick = function(event) {
        if (event.target == reservaModal) {
            reservaModal.style.display = "none";
        }
        if (event.target == addMesaModal) {
            addMesaModal.style.display = "none";
        }
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
    };
}

function abrirModal(index) {
    var modal = document.getElementById('modalReserva');
    modal.style.display = 'flex';
    document.getElementById('reservarButton').onclick = function() {
        reservarMesa(index);
    };
}

function abrirAddMesaModal() {
    editingMesaId = null;
    var modal = document.getElementById('addMesaModal');
    document.getElementById('coordenadas').value = '';
    document.getElementById('nome').value = '';
    modal.style.display = 'flex';
    document.getElementById('salvarMesaButton').onclick = adicionarMesa;
}

function abrirEditarMesaModal(id, coordenadas, nome) {
    editingMesaId = id;
    var modal = document.getElementById('addMesaModal');
    document.getElementById('coordenadas').value = coordenadas;
    document.getElementById('nome').value = nome;
    modal.style.display = 'flex';
    document.getElementById('salvarMesaButton').onclick = editarMesa;
}

async function adicionarMesa() {
    var coordenadas = document.getElementById('coordenadas').value.trim();
    var nome = document.getElementById('nome').value.trim();
    var novaMesa = {
        coordenadas: coordenadas,
        nome: nome
    };
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaMesa)
    });
    const result = await response.json();
    console.log(result);
    exibirMesasAdmin();
    closeAddModal();
}

async function editarMesa() {
    var coordenadas = document.getElementById('coordenadas').value.trim();
    var nome = document.getElementById('nome').value.trim();
    var mesaEditada = {
        id: editingMesaId,
        coordenadas: coordenadas,
        nome: nome
    };
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mesaEditada)
    });
    const result = await response.json();
    console.log(result);
    exibirMesasAdmin();
    closeAddModal();
}

function closeAddModal() {
    document.getElementById('addMesaModal').style.display = 'none';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function abrirLoginModal() {
    var modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
}
