document.addEventListener('DOMContentLoaded', function () {
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
    const container = document.getElementById('mesas');
    container.innerHTML = '';
    mesas.forEach((mesa, index) => {
        const div = document.createElement('div');
        div.classList.add('mesa');
        div.innerHTML = `Mesa ${mesa.id} em ${mesa.coordenadas}: ${mesa.status}` +
                        (mesa.nome ? ` - Cliente: ${mesa.nome}` : '') +
                        `<button onclick="abrirModal(${index})">Reservar</button>`;
        container.appendChild(div);
    });
}

function adicionarMesa() {
    const novaId = mesas.length > 0 ? mesas[mesas.length - 1].id + 1 : 1;
    const novaCoordenada = prompt("Digite as coordenadas para a nova mesa (ex: C3):");
    mesas.push({ id: novaId, coordenadas: novaCoordenada, status: 'Disponível', nome: "" });
    exibirMesasAdmin();
    exibirMesasCliente();
}

function abrirModal(index) {
    if (mesas[index].status === 'Disponível') {
        document.getElementById('nomeReserva').value = "";
        document.getElementById('modalReserva').style.display = 'block';
        document.getElementById('reservarButton').onclick = function() { reservarMesa(index); };
    } else {
        alert("Mesa já está reservada!");
    }
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
    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        };
    } else {
        console.error("Elemento 'close' não encontrado!");
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
