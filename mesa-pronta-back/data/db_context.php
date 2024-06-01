<?php

require_once("config.php");

class DbContext {
    private $host;
    private $porta;
    private $dbname;
    private $usuario;
    private $senha;

    private $conexao;

    public function __construct() {
        $this->host = MYSQL_DB_HOST;
        $this->porta = MYSQL_DB_PORT;
        $this->dbname = MYSQL_DB_DATABASE;
        $this->usuario = MYSQL_DB_USERNAME;
        $this->senha = MYSQL_DB_PASSWORD;
    }

    public function conectar() {
        $this->conexao = new mysqli($this->host, $this->usuario, $this->senha, $this->dbname, $this->porta);
    
        if ($this->conexao->connect_error) {
            die("Conexão falhou: " . $this->conexao->connect_error);
        }
    }
    
    public function desconectar() {
        $this->conexao->close();
    }

    public function executar_query_sql($query) {
        $resultado = $this->conexao->query($query);
    
        if (!$resultado) {
            $error = array('error' => $this->conexao->error);
            return json_encode($error);
        }
    
        if ($resultado === TRUE) {
            return json_encode(array('success' => TRUE));
        }
    
        if ($resultado->num_rows > 0) {
            $linhas = array();
            while ($linha = $resultado->fetch_assoc()) {
                $linhas[] = $linha;
            }
            return json_encode($linhas);
        }
    
        return json_encode(array('success' => FALSE));
    }
}
?>
