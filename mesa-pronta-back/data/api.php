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

    public function reservarMesa($id, $nome) {
        $mesa = $this->db->executar_query_sql_array("SELECT status FROM mesas WHERE id = $id");
        if ($mesa[0]['status'] == 'Disponível') {
            $query = "UPDATE mesas SET status = 'Reservado', nome = '$nome' WHERE id = $id";
            return $this->db->executar_query_sql($query);
        } else {
            return json_encode(['success' => false, 'message' => 'Mesa já reservada']);
        }
    }

    public function liberarMesa($id) {
        $query = "UPDATE mesas SET status = 'Disponível', nome = '' WHERE id = $id";
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
        if ($status == 'Disponível') {
            return $this->liberarMesa($id);
        } else {
            return json_encode(['success' => false, 'message' => 'Action not allowed directly.']);
        }
    }

    public function autenticarAdmin($username, $password) {
        $query = "SELECT * FROM users WHERE username = '$username'";
        $result = $this->db->executar_query_sql_array($query);

        error_log("Query result: " . print_r($result, true));

        if (is_array($result) && count($result) > 0) {
            $user = $result[0];
            error_log("User found: " . print_r($user, true));
            error_log("Comparing password: input($password) == stored(" . $user['password'] . ")");
            if (strcmp($password, $user['password']) === 0) {
                error_log("Password match");
                return json_encode(['success' => true]);
            } else {
                error_log("Password mismatch: input($password) != stored(" . $user['password'] . ")");
            }
        } else {
            error_log("No user found");
        }
        return json_encode(['success' => false]);
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
        if (isset($data['id'], $data['nome']) && !isset($data['coordenadas'])) {
            echo $api->reservarMesa($data['id'], $data['nome']);
        } elseif (isset($data['id'], $data['status'])) {
            echo $api->alterarStatusMesa($data['id'], $data['status']);
        } elseif (isset($data['id'], $data['coordenadas'])) {
            echo $api->atualizarMesa($data['id'], $data['coordenadas'], isset($data['nome']) ? $data['nome'] : '');
        }
        break;
    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
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
