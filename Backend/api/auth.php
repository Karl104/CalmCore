<?php
// Basic debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Test if the file is being accessed
echo json_encode([
    "status" => "test",
    "message" => "API endpoint is accessible"
]);
exit;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

class Auth {
    private $conn;
    private $table_name = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Register new user
    public function register($email, $password, $name) {
        try {
            // Check if email already exists
            $check_query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(":email", $email);
            $check_stmt->execute();

            if($check_stmt->rowCount() > 0) {
                return array(
                    "status" => "error",
                    "message" => "Email already exists"
                );
            }

            // Hash password
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            // Insert new user
            $query = "INSERT INTO " . $this->table_name . " 
                    (email, password, name, created_at) 
                    VALUES 
                    (:email, :password, :name, NOW())";

            $stmt = $this->conn->prepare($query);

            // Sanitize input
            $email = htmlspecialchars(strip_tags($email));
            $name = htmlspecialchars(strip_tags($name));

            // Bind values
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":password", $hashed_password);
            $stmt->bindParam(":name", $name);

            if($stmt->execute()) {
                return array(
                    "status" => "success",
                    "message" => "Registration successful"
                );
            }

            return array(
                "status" => "error",
                "message" => "Registration failed"
            );

        } catch(PDOException $e) {
            error_log("Registration error: " . $e->getMessage());
            return array(
                "status" => "error",
                "message" => "Registration failed: " . $e->getMessage()
            );
        }
    }

    // Login user
    public function login($email, $password) {
        try {
            $query = "SELECT id, email, password, name, role 
                     FROM " . $this->table_name . " 
                     WHERE email = :email";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Verify password
                if(password_verify($password, $row['password'])) {
                    // Update last login
                    $update_query = "UPDATE " . $this->table_name . " 
                                   SET last_login = NOW() 
                                   WHERE id = :id";
                    $update_stmt = $this->conn->prepare($update_query);
                    $update_stmt->bindParam(":id", $row['id']);
                    $update_stmt->execute();

                    // Remove password from response
                    unset($row['password']);

                    return array(
                        "status" => "success",
                        "message" => "Login successful",
                        "user" => $row
                    );
                }
            }

            return array(
                "status" => "error",
                "message" => "Invalid email or password"
            );

        } catch(PDOException $e) {
            return array(
                "status" => "error",
                "message" => $e->getMessage()
            );
        }
    }

    // Forgot password
    public function forgotPassword($email) {
        try {
            // Check if email exists
            $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                // Generate a unique token
                $token = bin2hex(random_bytes(32));
                $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

                // Store the token in the database
                $update_query = "UPDATE " . $this->table_name . " 
                               SET reset_token = :token, 
                                   reset_token_expiry = :expiry 
                               WHERE email = :email";
                $update_stmt = $this->conn->prepare($update_query);
                $update_stmt->bindParam(":token", $token);
                $update_stmt->bindParam(":expiry", $expiry);
                $update_stmt->bindParam(":email", $email);
                $update_stmt->execute();

                // In a real application, you would send an email with the reset link
                // For now, we'll just return success
                return array(
                    "status" => "success",
                    "message" => "Password reset instructions have been sent to your email"
                );
            }

            // Even if the email doesn't exist, we return success for security
            return array(
                "status" => "success",
                "message" => "If an account with that email exists, a password reset link has been sent"
            );

        } catch(PDOException $e) {
            return array(
                "status" => "error",
                "message" => $e->getMessage()
            );
        }
    }
}

// Handle incoming requests
try {
    $database = new Database();
    $db = $database->getConnection();
    $auth = new Auth($db);

    $data = json_decode(file_get_contents("php://input"));
    
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if(isset($data->action)) {
            switch($data->action) {
                case 'register':
                    if(isset($data->email) && isset($data->password) && isset($data->name)) {
                        $result = $auth->register($data->email, $data->password, $data->name);
                        echo json_encode($result);
                    } else {
                        echo json_encode(array(
                            "status" => "error",
                            "message" => "Missing required fields"
                        ));
                    }
                    break;

                case 'login':
                    if(isset($data->email) && isset($data->password)) {
                        $result = $auth->login($data->email, $data->password);
                        echo json_encode($result);
                    } else {
                        echo json_encode(array(
                            "status" => "error",
                            "message" => "Missing email or password"
                        ));
                    }
                    break;

                case 'forgot_password':
                    if(isset($data->email)) {
                        $result = $auth->forgotPassword($data->email);
                        echo json_encode($result);
                    } else {
                        echo json_encode(array(
                            "status" => "error",
                            "message" => "Email is required"
                        ));
                    }
                    break;

                default:
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Invalid action"
                    ));
            }
        } else {
            echo json_encode(array(
                "status" => "error",
                "message" => "No action specified"
            ));
        }
    }
} catch(Exception $e) {
    error_log("API error: " . $e->getMessage());
    echo json_encode(array(
        "status" => "error",
        "message" => "Server error: " . $e->getMessage()
    ));
}
?> 