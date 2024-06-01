const API_URL = 'http://localhost:8000/api.php';
let isAdmin = false;

document.addEventListener('DOMContentLoaded', function () {
    setupModals();
    if (document.getElementById('tabelaMesas')) {
        exibirMesasAdmin();
    } else if (document.getElementById('mesas')) {
        exibirMesasCliente();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
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
                window.location.href = 'dashboard.html';
            } else {
                alert('Login falhou');
            }
        });
    }
});

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
            <button onclick="editarMesa(${mesa.id})">Reservar</button>
            <button onclick="removerReserva(${mesa.id})">Remover Reserva</button>
            <button onclick="atualizarMesa(${mesa.id})">Editar Coordenadas</button>
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

async function atualizarMesa(index) {
    const coordenadas = prompt("Atualize as coordenadas da mesa (ex: D4):", mesas[index].coordenadas);
    if (coordenadas) {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: index, coordenadas: coordenadas })
        });
        const result = await response.json();
        console.log(result);
        exibirMesasAdmin();
    }
}

async function removerReserva(index) {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: index, removerReserva: true })
    });
    const result = await response.json();
    console.log(result);
    exibirMesasAdmin();
}

async function editarMesa(index) {
    const novoNome = prompt("Atualize o nome do cliente:", mesas[index].nome);
    if (novoNome) {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: index, nome: novoNome })
        });
        const result = await response.json();
        console.log(result);
        exibirMesasAdmin();
    }
}

function setupModals() {
    var reservaModal = document.getElementById("modalReserva");
    var addMesaModal = document.getElementById("addMesaModal");

    var reservaSpan = document.getElementsByClassName("close")[0];
    var addMesaSpan = document.getElementsByClassName("close")[1];

    reservaSpan.onclick = function() {
        reservaModal.style.display = "none";
    };
    addMesaSpan.onclick = function() {
        addMesaModal.style.display = "none";
    };
    
    window.onclick = function(event) {
        if (event.target == reservaModal) {
            reservaModal.style.display = "none";
        }
        if (event.target == addMesaModal) {
            addMesaModal.style.display = "none";
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
    var modal = document.getElementById('addMesaModal');
    modal.style.display = 'flex';
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

function closeAddModal() {
    document.getElementById('addMesaModal').style.display = 'none';
}
