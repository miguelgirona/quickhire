<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require dirname(__DIR__) . '/vendor/autoload.php';

class WebSocketServer implements MessageComponentInterface {
    protected $clients;
    protected $chatConnections; // Para mapear conexiones a chats

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->chatConnections = []; // chat_id => [ConnectionInterface, ...]
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        
        // Validar datos básicos
        if (!isset($data['id_chat'])) {
            echo "Mensaje sin id_chat, ignorando\n";
            return;
        }

        $chatId = $data['id_chat'];
        
        // Registrar la conexión para este chat si no está registrada
        if (!isset($this->chatConnections[$chatId])) {
            $this->chatConnections[$chatId] = [];
        }
        
        if (!in_array($from, $this->chatConnections[$chatId], true)) {
            $this->chatConnections[$chatId][] = $from;
        }

        // Enviar solo a conexiones interesadas en este chat
        if (isset($this->chatConnections[$chatId])) {
            foreach ($this->chatConnections[$chatId] as $client) {
                // No reenviar al remitente original si lo prefieres
                // if ($client !== $from) {
                    $client->send(json_encode([
                        'id_chat'     => $chatId,
                        'id_remitente' => $data['id_remitente'] ?? null,
                        'sender'      => $data['sender'] ?? 'Unknown',
                        'message'     => $data['message'] ?? '',
                        'timestamp'   => date('c') // ISO 8601 como en el cliente
                    ]));
                // }
            }
        }
        
        echo "Mensaje para chat {$chatId} enviado a " . count($this->chatConnections[$chatId] ?? 0) . " clientes\n";
    }

    public function onClose(ConnectionInterface $conn) {
        // Limpiar de todos los chats
        foreach ($this->chatConnections as $chatId => $connections) {
            $this->chatConnections[$chatId] = array_filter($connections, function($c) use ($conn) {
                return $c !== $conn;
            });
            
            if (empty($this->chatConnections[$chatId])) {
                unset($this->chatConnections[$chatId]);
            }
        }
        
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}

// Crear el servidor
$port = 8082;
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketServer()
        )
    ),
    $port
);

echo "WebSocket server running on port {$port}\n";

$server->run();