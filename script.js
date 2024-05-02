document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('modalReserva');
    modal.style.display = 'none';  // Força o modal a ficar escondido ao carregar a página
    setupModal();
    if (document.getElementById('tabelaMesas')) {
        exibirMesasAdmin();
    } else if (document.getElementById('mesas')) {
        exibirMesasCliente();
    }
});

let mesas = [
    { id: 1, coordenadas: 'A9', status: 'Disponível', nome: "" },
    { id: 2, coordenadas: 'A2', status: 'Reservado', nome: "Paula" },
    { id: 3, coordenadas: 'B1', status: 'Disponível', nome: "" },
    { id: 4, coordenadas: 'A3', status: 'Disponível', nome: "" },
    { id: 5, coordenadas: 'A5', status: 'Reservado', nome: "Orlando" },
    { id: 6, coordenadas: 'B2', status: 'Disponível', nome: "" },
    { id: 7, coordenadas: 'A1', status: 'Disponível', nome: "" },
    { id: 8, coordenadas: 'A3', status: 'Reservado', nome: "Claudia" },
    { id: 9, coordenadas: 'B5', status: 'Disponível', nome: "" },
    { id: 10, coordenadas: 'B6', status: 'Disponível', nome: "" }
];

function exibirMesasAdmin() {
    const tbody = document.getElementById('tabelaMesas').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpa a tabela
    mesas.forEach((mesa, index) => {
        let row = tbody.insertRow();
        row.insertCell(0).innerText = mesa.id;
        row.insertCell(1).innerText = mesa.coordenadas;
        row.insertCell(2).innerText = mesa.status;
        row.insertCell(3).innerText = mesa.nome ? mesa.nome : 'N/A';
        row.insertCell(4).innerHTML = `
            <button onclick="editarMesa(${index})">Reservar</button>
            <button onclick="removerReserva(${index})">Remover Reserva</button>
            <button onclick="atualizarMesa(${index})">Editar Coordenadas</button>
            <button onclick="removerMesa(${index})">Remover Mesa</button>`;
    });
}


function exibirMesasCliente() {
    const tbody = document.getElementById('clienteMesas').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';  // Limpa qualquer conteúdo existente
    mesas.forEach((mesa, index) => {
        let row = tbody.insertRow();  // Cria uma nova linha
        row.insertCell(0).innerText = mesa.id;  // ID da mesa
        row.insertCell(1).innerText = mesa.coordenadas;  // Coordenadas
        row.insertCell(2).innerText = mesa.status;  // Status da reserva
        row.insertCell(3).innerText = mesa.nome ? mesa.nome : 'N/A';  // Nome do cliente
        row.insertCell(4).innerHTML = `<button onclick="abrirModal(${index})">Reservar</button>`;  // Botão de ação
    });
}


function reservarMesa(index) {
    const nome = document.getElementById('nomeReserva').value.trim();
    if (nome) {
        mesas[index].nome = nome;
        mesas[index].status = 'Reservado';
        document.getElementById('modalReserva').style.display = 'none';
        exibirMesasAdmin();
        exibirMesasCliente();
    } else {
        alert("Por favor, insira um nome para fazer a reserva.");
    }
}

function removerMesa(index) {
    mesas.splice(index, 1);
    exibirMesasAdmin();
    exibirMesasCliente();
}

function atualizarMesa(index) {
    const coordenadas = prompt("Atualize as coordenadas da mesa (ex: D4):", mesas[index].coordenadas);
    if (coordenadas) {
        mesas[index].coordenadas = coordenadas;
        exibirMesasAdmin();
    }
}

function removerReserva(index) {
    if (mesas[index].status === 'Reservado') {
        mesas[index].status = 'Disponível';
        mesas[index].nome = "";
        alert("Reserva removida com sucesso.");
        exibirMesasAdmin();
    } else {
        alert("Esta mesa não está reservada.");
    }
}

function editarMesa(index) {
    const novoNome = prompt("Atualize o nome do cliente:", mesas[index].nome);
    if (novoNome) {
        mesas[index].nome = novoNome;
        mesas[index].status = 'Reservado'; 
        exibirMesasAdmin();
    }
}

function setupModal() {
    var modal = document.getElementById("modalReserva");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    };
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function abrirModal(index) {
    var modal = document.getElementById('modalReserva');
    if (mesas[index].status === 'Disponível') {
        modal.style.display = 'flex'; // Abre o modal somente quando esta condição é verdadeira
    } else {
        alert("Mesa já está reservada!");
    }
}

function adicionarMesa() {
    document.getElementById('addMesaModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addMesaModal').style.display = 'none';
}

function salvarNovaMesa() {
    var coordenadas = document.getElementById('coordenadas').value.trim();
    var nome = document.getElementById('nome').value.trim();
    var novaMesa = {
        id: mesas.length + 1,
        coordenadas: coordenadas,
        status: nome ? 'Reservado' : 'Disponível',
        nome: nome
    };
    mesas.push(novaMesa);
    exibirMesasAdmin();
    closeAddModal();
}

