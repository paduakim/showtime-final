<?php

class GlobalMethods
{
    protected $pdo;


    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }
    public function executeQuery($sql)
    {
        $data = array();
        $errmsg = "";
        $code = 0;

        try {
            if ($result = $this->pdo->query($sql)->fetchAll()) {
                foreach ($result as $record) {
                    array_push($data, $record);
                }
                $code = 200;
                return array("code" => $code, "data" => $data);
            } else {
                $errmsg = 'No data found';
                $code = 404;
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function returnPayload($payload, $remarks, $message, $code)
    {
        $status = array("remarks" => $remarks, "message" => $message);
        http_response_code($code);
        return array("status" => $status, "payload" => $payload, "timestamp" => date_create());
    }

    // global insert function
    public function insert($table_name, $data)
    {
        $fields = [];
        $values = [];

        foreach ($data as $key => $value) {
            array_push($fields, $key);
            array_push($values, $value);
        }

        try {
            $counter = 0;
            $sql_str = "INSERT INTO $table_name (";

            foreach ($fields as $value) {
                $sql_str .= $value;
                $counter++;
                if ($counter < count($fields)) {
                    $sql_str .= ", ";
                }
            }

            $sql_str .= ") VALUES (" . str_repeat('?, ', count($values) - 1) . "?)";
            $sql = $this->pdo->prepare($sql_str);
            $sql->execute($values);
            return array("code" => 200, "remarks" => "success");
        } catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }
    // global update function
    public function update($table_name, $data)
    {
        $fields = [];
        $values = [];
        // passing data to these arrays..
        foreach ($data as $key => $value) {
            array_push($fields, $key);
            array_push($values, $value);
        }
        //try
        try {
            $counter = 0;
            $sql_str = "UPDATE $table_name SET ";
            // advanced foreach loop uses 2 arrays but can use many arrays..
            foreach ($fields as $index => $value) {
                // ensures that the recno_fld is untouchable..
                if ($value === "id") {
                    // do nothing..
                }
                // if not recno_fld then move on..
                else {
                    $sql_str .= " $value = '$values[$index]',";
                }
            }
            // now because we habe commas for each sql strings we wanna remove the last one..
            $sql_str = rtrim($sql_str, ',');
            // where recno_fld is something..
            $sql_str .= " WHERE id = $data->id;";
            // prepare sql stmts
            $sql = $this->pdo->prepare($sql_str);
            // execute em..
            $sql->execute();
            // if worked ..
            return array("code" => 200, "remarks" => "success");
        }
        // if not..
        catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        // return whatever..
        return array("code" => $code, "errmsg" => $errmsg);
    }




    // global delete function
    public function delete($table_name, $condition_string)
    {
        // sql stuff
        // $book_location = $data->book_location;
        $sql = "DELETE FROM $table_name WHERE {$condition_string}";
        // unlink($book_location);
        // try sql if worked..
        try {
            $sql = $this->pdo->prepare($sql);
            $sql->execute();
            return array("status code" => 200, "remarks" => "deleted successfully!");
        }
        // catch errors..
        catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        // return if worked and if not return error message..
        return array("code" => $code, "errmsg" => $errmsg);
    }

    // global pdf print function
    public function pdffile($table_name, $data, $condition_string)
    {
        $book_id = $_GET['id'];
        try {

            if ($_FILES['file']['name'] != '') {
                $test = explode('.', $_FILES['file']['name']);
                $extension = end($test);
                $allowedExts = array("gif", "jpeg", "jpg", "png", "pdf");
                if ((($_FILES["file"]["type"] == "image/gif")
                        || ($_FILES["file"]["type"] == "image/jpeg")
                        || ($_FILES["file"]["type"] == "image/jpg")
                        || ($_FILES["file"]["type"] == "image/pjpeg")
                        || ($_FILES["file"]["type"] == "image/x-png")
                        || ($_FILES["file"]["type"] == "image/png")
                        || ($_FILES["file"]["type"] == "application/pdf"))
                    && ($_FILES["file"]["size"] < 200000000)
                    && in_array($extension, $allowedExts)
                )
                    $name = date("Y-m-d") . rand(100, 999999999999) . '.' . $extension;
                $location = '../uploads/' . $name;
                move_uploaded_file($_FILES['file']['tmp_name'], $location);
            }

            $sql_str = "UPDATE $table_name SET book_location = '$location' WHERE book_id = '$book_id'";
            // prepare sql stmts
            $sql = $this->pdo->prepare($sql_str);
            // var_dump($sql);
            // execute em..
            $sql->execute();
            // if worked ..
            return array("Successfully uploaded!");
        }
        // if not..
        catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        // return whatever..
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function payCheckOutItemsCashPayment($data)
    {
        $employee_id = $data->employee_id;
        $payment_mode = $data->payment_mode;
        $grand_total = $data->grand_total;

        $sql = "INSERT INTO pos_orders (`employee_id`, `payment_mode`, `status`, `is_paid`, `grand_total`)
        VALUES ($employee_id, '$payment_mode', 'Pending', 'Yes', '$grand_total')";

        try {
            $sql = $this->pdo->prepare($sql);
            $sql->execute();

            $sql = "SELECT MAX(id) AS id from pos_orders";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll()[0];
            $order_id = $res['id'];

            $sql = "INSERT INTO pos_cart(`order_id`, `dish_id`, `item_total`, `item_quantity`)
        VALUES ";
            for ($count = 0; $count < count((array)$data->dish_id); $count++) {
                // var_dump($data[$count]->item_name);
                if ($count == count((array)$data->dish_id) - 1) {
                    $sql .= "($order_id,
                    '" . $data->dish_id[$count] . "', 
                    '" . $data->total[$count] . "', 
                    '" . $data->quantity[$count] . "')";
                } else {
                    $sql .= "($order_id,
                    '" . $data->dish_id[$count] . "', 
                    '" . $data->total[$count] . "', 
                    '" . $data->quantity[$count] . "'),";
                }
            }
            // var_dump($sql);

            try {
                $sql = $this->pdo->prepare(rtrim($sql, ","));
                $sql->execute();
                return array("status code" => 200, "remarks" => "Create order and cart items successfully");
            } catch (Exception $e) {
                $errmsg = "Unable to create cart items.";
                $code = 403;
            }
            return array("code" => $code, "errmsg" => $errmsg);
        } catch (Exception $e) {
            $errmsg = "Unable to create an order";
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function chargeCheckOutItemsCashPayment($data)
    {
        $employee_id = $data->employee_id;
        $payment_mode = $data->payment_mode;
        $grand_total = $data->grand_total;
        $invoice_id = $data->invoice_id;

        $sql = "INSERT INTO pos_orders (`employee_id`, `invoice_id`, `payment_mode`, `status`, `is_paid`, `grand_total`)
        VALUES ($employee_id, '$invoice_id','$payment_mode', 'Pending', 'No', '$grand_total')";

        try {
            $sql = $this->pdo->prepare($sql);
            $sql->execute();

            $sql = "SELECT MAX(id) AS id from pos_orders";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll()[0];
            $order_id = $res['id'];

            $sql = "INSERT INTO pos_cart(`order_id`, `dish_id`, `item_total`, `item_quantity`)
        VALUES ";
            for ($count = 0; $count < count((array)$data->dish_id); $count++) {
                // var_dump($data[$count]->item_name);
                if ($count == count((array)$data->dish_id) - 1) {
                    $sql .= "($order_id,
                    '" . $data->dish_id[$count] . "', 
                    '" . $data->total[$count] . "', 
                    '" . $data->quantity[$count] . "')";
                } else {
                    $sql .= "($order_id,
                    '" . $data->dish_id[$count] . "', 
                    '" . $data->total[$count] . "', 
                    '" . $data->quantity[$count] . "'),";
                }
            }
            // var_dump($sql);

            try {
                $sql = $this->pdo->prepare(rtrim($sql, ","));
                $sql->execute();

                $sql = "SELECT total_food_charge FROM billing_invoice WHERE id = $invoice_id";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute();
                $res = $stmt->fetchAll()[0];
                $total_food_charge = $res['total_food_charge'];

                $total_food_charge += $grand_total;

                $sql = "UPDATE billing_invoice SET total_food_charge = '$total_food_charge'";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute();

                return array("status code" => 200, "remarks" => "Create order and cart items successfully");
            } catch (Exception $e) {
                $errmsg = "Unable to create cart items.";
                $code = 403;
            }
            return array("code" => $code, "errmsg" => $errmsg);
        } catch (Exception $e) {
            $errmsg = "Unable to create an order";
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }



    public function update_item($table_name, $data)
    {

        $sql = "UPDATE $table_name
        SET status = '$data->status'
        WHERE id = '$data->order_id' ";

        try {
            $sql = $this->pdo->prepare($sql);
            $sql->execute();
            return array("code" => 200, "remarks" => "success");
        } catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function update_paid($table_name, $data)
    {

        $sql = "UPDATE $table_name
        SET is_paid = '$data->is_paid'
        WHERE id = '$data->order_id' ";

        try {
            $sql = $this->pdo->prepare($sql);
            $sql->execute();
            return array("code" => 200, "remarks" => "success");
        } catch (Exception $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }
}
