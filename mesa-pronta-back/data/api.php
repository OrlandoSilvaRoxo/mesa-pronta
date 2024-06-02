<?php

require_once("db_context.php");

class MesaAPI {
    private $db;

    public function __construct() {
        $this->db = new DbContext();
        $this->db->conectar();
    }

    public function __destruct() {
        $this->db->desconectar();
    }

    public function getMesas() {
        $query = "SELECT * FROM mesas";
        return $this->db->executar_query_sql($query);
    }

    public function reservarMesa($id, $status) {
        $novoStatus = ($status == 'Disponível') ? 'Reservado' : 'Disponível';
        $query = "UPDATE mesas SET status = '$novoStatus' WHERE id = $id";
        return $this->db->executar_query_sql($query);
    }

    public function atualizarMesa($id, $coordenadas, $nome = '') {
        $query = "UPDATE mesas SET coordenadas = '$coordenadas', nome = '$nome' WHERE id = $id";
        return $this->db->executar_query_sql($query);
    }

    public function removerMesa($id) {
        $query = "DELETE FROM mesas WHERE id = $id";
        return $this->db->executar_query_sql($query);
    }

    public function adicionarMesa($coordenadas, $nome) {
        $status = $nome ? 'Reservado' : 'Disponível';
        $query = "INSERT INTO mesas (coordenadas, status, nome) VALUES ('$coordenadas', '$status', '$nome')";
        return $this->db->executar_query_sql($query);
    }

    public function alterarStatusMesa($id, $status) {
        $novoStatus = ($status == 'Disponível') ? 'Reservado' : 'Disponível';
        $query = "UPDATE mesas SET status = '$novoStatus' WHERE id = $id";
        return $this->db->executar_query_sql($query);
    }

    public function autenticarAdmin($username, $password) {
        // Mocked login credentials
        $validUsername = 'admin';
        $validPassword = '123';

        if ($username === $validUsername && $password === $validPassword) {
            return json_encode(['success' => true]);
        } else {
            return json_encode(['success' => false]);
        }
    }
}

$api = new MesaAPI();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "OPTIONS") {
    http_response_code(200);
    exit();
}

switch ($method) {
    case 'GET':
        echo $api->getMesas();
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['username'], $data['password'])) {
            echo $api->autenticarAdmin($data['username'], $data['password']);
        } else {
            echo $api->adicionarMesa($data['coordenadas'], $data['nome']);
        }
        break;
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'], $data['nome'], $data['coordenadas'])) {
            echo $api->atualizarMesa($data['id'], $data['coordenadas'], $data['nome']);
        } elseif (isset($data['id'], $data['status'])) {
            echo $api->alterarStatusMesa($data['id'], $data['status']);
        }
        break;
    case 'DELETE':
        parse_str(file_get_contents('php://input'), $data);
        if (isset($data['id'])) {
            echo $api->removerMesa($data['id']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
        break;
}
?>
