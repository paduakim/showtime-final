<?php

class Get
{

    protected $pdo;
    protected $gm;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->gm = new GlobalMethods($pdo);
    }

    // create your own get functions!!!

    public function get_common($table, $condition = null)
    {
        $sql = "SELECT * FROM $table WHERE $condition";
        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retieved from $table", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieve user account details", $res['code']);
    }

    public function getPosts($condition = null)
    {
        $sql = "SELECT posts.*, users.username, users.profile_pic,
        (SELECT count(comments.id) FROM comments where comments.post_id = posts.id) as comments, 
        (SELECT count(likes.post_id) FROM likes where likes.post_id = posts.id) as likes
                FROM posts
                JOIN users ON users.id = posts.user_id ";
        if ($condition != null) {
            $sql .= $condition;
        }

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }
    public function getFavorites($condition = null)
    {
        $sql = "SELECT favorites.post_id as id, posts.room_picture FROM favorites
        JOIN posts ON posts.id = favorites.post_id ";
        if ($condition != null) {
            $sql .= $condition;
        }

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }
    public function getSelectedUserPost($condition = null)
    {
        $sql = "SELECT id, room_picture
        FROM posts ";
        if ($condition != null) {
            $sql .= $condition;
        }

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }
    public function getComments($condition = null)
    {

        $sql = "SELECT comments.*, users.username, users.profile_pic
        FROM comments
        JOIN users ON users.id = comments.user_id
        JOIN posts ON posts.id = comments.post_id";

        if ($condition != null) {
            $sql .= " WHERE {$condition}";
        }

        $sql .= " ORDER BY date_created ASC";

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retieved from table", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieve user account details", $res['code']);
    }
    public function getLikesNumber($table, $condition = null)
    {

        $sql = "SELECT count(user_id) as id FROM likes";

        if ($condition != null) {
            $sql .= " WHERE {$condition}";
        }

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retieved from table", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieve user account details", $res['code']);
    }
    public function likePost($table, $condition = null)
    {
        $sql = "INSERT INTO likes (post_id, user_id) VALUES ";
        $sql .= $condition;
        $res = $this->gm->executeQuery($sql);

        return $this->gm->returnPayload(null, "success", "Succesfully retrieved sales ID", $res['code']);
    }
    public function addShowroom($table, $received_data)
    {
        $user_id = $received_data->user_id;
        $title = $received_data->title;
        $description = $received_data->description;
        $room_picture = $received_data->room_picture;

        $sql = "INSERT INTO $table (user_id, title, description, room_picture) VALUES ('$user_id', '$title', '$description', '$room_picture')";

        $res = $this->gm->executeQuery($sql);

        $sql = "SELECT MAX(id) AS id from $table";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll()[0];
        $order_id = $res['id'];

        $profile = array(
            "id" => $order_id
        );

        return $this->gm->returnPayload($profile, 'success', 'successfully inserted data', 200);
    }
    public function addShowroomWithPic($table, $received_data)
    {
        $user_id = $received_data->user_id;
        $title = $received_data->title;
        $description = $received_data->description;

        $sql = "SELECT MAX(id) AS id from posts";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll()[0];
        $id = $res['id'];


        $sql = "UPDATE $table SET user_id = '$user_id', title = '$title', description = '$description' WHERE id = $id";

        $res = $this->gm->executeQuery($sql);

        return $this->gm->returnPayload(null, 'success', 'successfully inserted data', 200);
    }


    public function getAllItems()
    {
        $sql = "SELECT * FROM pos_dish
        WHERE status = 'available'";

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }

    public function itemSelection($table, $condition)
    {
        $sql = "SELECT * FROM pos_dish";

        if ($condition != null) {
            $sql .= " WHERE ${condition}";
        }

        $res = $this->gm->executeQuery($sql);

        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved from $table", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieve data", $res['code']);
    }

    // public function createOrderForCashPayment($data)
    // {
    //     $employee_id = $data->employee_id;
    //     $payment_mode = $data->payment_mode;

    //     $sql = "INSERT INTO pos_orders (`employee_id`, `payment_mode`, `status`, `is_paid`)
    //     VALUES ($employee_id, '$payment_mode', 'Pending', 'No')";

    //     try {
    //         $sql = $this->pdo->prepare($sql);
    //         $sql->execute();

    //         $sql = "SELECT MAX(id) AS id from pos_orders";
    //         $stmt = $this->pdo->prepare($sql);
    //         $stmt->execute();
    //         $res = $stmt->fetchAll()[0];
    //         $order_id = $res['id'];

    //         $profile = array(
    //             "order_id" => $order_id
    //         );

    //         return $this->gm->returnPayload($profile, 'success', 'successfully inserted data', 200);
    //     } catch (Exception $e) {
    //         $errmsg = $e->getMessage();
    //         $code = 403;
    //     }
    //     return array("code" => $code, "errmsg" => $errmsg);
    // }

    public function receipt()
    {
        $sql = "SELECT MAX(pos_orders.id) AS id, ems_employees.fullname, pos_orders.created_at
        from pos_orders
        JOIN ems_employees ON pos_orders.employee_id = ems_employees.id";
        // $sql = "SELECT MAX(pos_orders.id) AS id, cdm_guest.first_name, cms_rooms.room_number, cdm_guest.last_name, ems_employees.fullname, pos_orders.created_at
        // from pos_orders
        // JOIN ems_employees ON pos_orders.employee_id = ems_employees.id
        // JOIN reservation_appointments ON pos_orders.invoice_id = reservation_appointments.invoice_id
        // JOIN cdm_guest ON reservation_appointments.guest_id = cdm_guest.id
        // JOIN cms_rooms ON reservation_appointments.room_id = cms_rooms.id";
        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }
    public function chargedReceipt()
    {
        // $sql = "SELECT MAX(pos_orders.id) AS id, ems_employees.fullname, pos_orders.created_at
        // from pos_orders
        // JOIN ems_employees ON pos_orders.employee_id = ems_employees.id";
        $sql = "SELECT MAX(pos_orders.id) AS id, cdm_guest.first_name, cms_rooms.room_number, cdm_guest.last_name, ems_employees.fullname, pos_orders.created_at
        from pos_orders
        JOIN ems_employees ON pos_orders.employee_id = ems_employees.id
        JOIN reservation_appointments ON pos_orders.invoice_id = reservation_appointments.invoice_id
        JOIN cdm_guest ON reservation_appointments.guest_id = cdm_guest.id
        JOIN cms_rooms ON reservation_appointments.room_id = cms_rooms.id";
        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }

    public function orderbreakdownTakeOutPaid($received_data)
    {
        $order_id = $received_data->order_id;

        $sql = "SELECT pos_cart.*, pos_dish.name
        FROM pos_cart 
        JOIN pos_dish ON pos_dish.id = pos_cart.dish_id
        WHERE pos_cart.order_id = '$order_id'";

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved sales ID", $res['code']);
        } else {
            return $this->gm->returnPayload(null, "Failed", "There are no current appointments being set.", $res['code']);
        }
    }
    // public function getAllTransactions($table, $condition = null){
    //     $sql = "SELECT order_id, name, price, item_quantity, item_quantity * price  as item_total
    //     FROM pos_cart INNER JOIN pos_dish ON pos_cart.dish_id = pos_dish.id";

    //     if ($condition != null) {
    //         $sql .= " WHERE {$condition}";
    //     }
    //     // var_dump($sql);

    //     // $sql .= "INNER JOIN items_tbl ON transactions_tbl.id = items_tbl.id";

    //     $res = $this->gm->executeQuery($sql);

    //     if($res['code'] == 200){
    //         return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved from $table", $res['code']);
    //     }

    //     return $this->gm->returnPayload(null, "failed", "failed to retrieve data", $res['code']);
    // }

    public function getReceiptDetails($table, $condition = null)
    {
        $sql = "SELECT $table.*, pos_orders.id, pos_dish.name, pos_dish.price
        FROM $table
        JOIN pos_orders ON pos_cart.order_id = pos_orders.id
        JOIN pos_dish ON pos_cart.dish_id = pos_dish.id";

        if ($condition != null) {
            $sql .= " WHERE {$condition}";
        }

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved data", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieved data", $res['code']);
    }
    public function getTableDetails($condition = null)
    {
        $sql = "SELECT pos_cart.*, pos_orders.table_id, pos_dish.name, pos_dish.price, pos_orders.table_id
        FROM pos_cart
        JOIN pos_orders ON pos_cart.order_id = pos_orders.id
        JOIN pos_dish ON pos_cart.dish_id = pos_dish.id";

        // WHERE pos_orders.status = 'Pending' AND pos_orders.table_id = 1";



        if ($condition != null) {
            $sql .= " WHERE {$condition}";
        }

        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retrieved data", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieved data", $res['code']);
    }

    public function getguestInfo($table, $condition = null)
    {
        $sql = "SELECT reservation_appointments.invoice_id, cdm_guest.first_name, cdm_guest.last_name, cms_rooms.room_number
        FROM reservation_appointments
        JOIN cdm_guest ON reservation_appointments.guest_id = cdm_guest.id
        JOIN cms_rooms ON reservation_appointments.room_id = cms_rooms.id
        WHERE reservation_appointments.status='CHECKED-IN'";


        $res = $this->gm->executeQuery($sql);
        if ($res['code'] == 200) {
            return $this->gm->returnPayload($res['data'], "success", "Succesfully retieved student records", $res['code']);
        }

        return $this->gm->returnPayload(null, "failed", "failed to retrieved data", $res['code']);
    }

    public function file($condition_string = null)
    {

        try {

            if ($_FILES['file']['name'] != '') {
                $test = explode('.', $_FILES['file']['name']);
                $extension = end($test);
                $allowedExts = array("jpeg", "jpg", "png");
                if ((($_FILES["file"]["type"] == "image/jpeg")
                    || ($_FILES["file"]["type"] == "image/jpg")
                    || ($_FILES["file"]["type"] == "image/pjpeg")
                    || ($_FILES["file"]["type"] == "image/x-png")
                    || ($_FILES["file"]["type"] == "image/png")))
                    $name = date("Y-m-d") . rand(100, 999999999999) . '.' . $extension;
                // $location = '../uploads/'.$name;
                $location = '../assets/pictures/' . $name;
                $room_location = '/assets/pictures/' . $name;
                move_uploaded_file($_FILES['file']['tmp_name'], $location);

                $sql_str = "INSERT INTO posts (`room_picture`) VALUES ('$room_location')";
                $sql = $this->pdo->prepare($sql_str);
                $sql->execute();
                return $this->gm->returnPayload(null, "success", "image saved", 200);
            }


            // // unlink($location);

            // // prepare sql stmts
            // // var_dump($sql);
            // // execute em..
        }
        // if not..
        catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
    }
    public function editProfilePic($condition_string = null)
    {

        try {

            if ($_FILES['file']['name'] != '') {
                $test = explode('.', $_FILES['file']['name']);
                $extension = end($test);
                $allowedExts = array("jpeg", "jpg", "png");
                if ((($_FILES["file"]["type"] == "image/jpeg")
                    || ($_FILES["file"]["type"] == "image/jpg")
                    || ($_FILES["file"]["type"] == "image/pjpeg")
                    || ($_FILES["file"]["type"] == "image/x-png")
                    || ($_FILES["file"]["type"] == "image/png")))
                    $name = date("Y-m-d") . rand(100, 999999999999) . '.' . $extension;
                // $location = '../uploads/'.$name;
                $location = '../assets/profile_pictures/' . $name;
                $room_location = '/assets/profile_pictures/' . $name;
                move_uploaded_file($_FILES['file']['tmp_name'], $location);

                $sql_str = "UPDATE users set profile_pic='$room_location' ";
                $sql_str .= $condition_string;
                $sql = $this->pdo->prepare($sql_str);
                $sql->execute();
                return $this->gm->returnPayload($sql_str, "success", "image saved", 200);
            }
        }
        // if not..
        catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
    }
}
