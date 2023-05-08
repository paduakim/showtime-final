<?php
require_once "./config/Connection.php";
require_once "./mainmodule/Get.php";
require_once "./mainmodule/Auth.php";
require_once "./mainmodule/Global.php";

$db = new Connection();
$pdo = $db->connect();
$global = new GlobalMethods($pdo);
$get = new Get($pdo);
$auth = new Auth($pdo);

if (isset($_REQUEST['request'])) {
    $req = explode('/', rtrim($_REQUEST['request'], '/'));
} else {
    $req = array("errorcatcher");
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        switch ($req[0]) {
            case 'login':
                echo json_encode($auth->login($data));
                break;

            case 'addComment':
                echo json_encode($global->insert("comments", $data));
                break;

            case 'register':
                echo json_encode($auth->register($data));
                break;

            case 'editPassword':
                echo json_encode($auth->editPassword($data));
                break;

            case 'addShowroom':
                echo json_encode($get->addShowroom("posts", $data));
                break;

            case 'addShowroomWithPic':
                echo json_encode($get->addShowroomWithPic("posts", $data));
                break;

            case 'editBio':
                echo json_encode($global->update("users", $data));
                break;

            case 'addImagefile':
                // if (count($req) > 1) {
                echo json_encode($get->file());
                // }
                break;
            case 'editProfilePic':
                // if (count($req) > 1) {
                echo json_encode($get->editProfilePic("WHERE id = '$req[1]'"));
                // }
                break;

            case 'likePost':
                echo json_encode($global->insert("likes", $data));
                break;

            case 'addtobookmark':
                echo json_encode($global->insert("favorites", $data));
                break;

            default:
                echo "request not found";
                break;
        }
        break;

    case 'GET':
        $data = json_decode(file_get_contents("php://input"));
        switch ($req[0]) {

            case 'getPosts':
                echo json_encode($get->getPosts("ORDER BY date_created DESC"));
                break;

            case 'getFavorites':
                echo json_encode($get->getFavorites("WHERE favorites.user_id = '$req[1]'"));
                break;
            case 'getSelectedUserPost':
                echo json_encode($get->getSelectedUserPost("WHERE user_id = '$req[1]'"));
                break;

            case 'getBioProfile':
                echo json_encode($get->get_common("users", "id = '$req[1]'"));
                break;

            case 'getTopPosts':
                echo json_encode($get->getPosts("ORDER BY likes DESC LIMIT 10"));
                break;

            case 'getMyPosts':
                echo json_encode($get->getPosts("WHERE posts.user_id = '$req[1]'"));
                break;

                // case 'getIndivPost':
                //     echo json_encode($get->getIndivPost($data));
                //     break;

            case 'getComments':
                if (count($req) > 1) {
                    echo json_encode($get->getComments("posts.id = '$req[1]'"));
                } else {
                    echo json_encode($get->getComments());
                }
                break;


            case 'deletebookmark':
                if (count($req) > 1) {
                    echo json_encode($global->delete('favorites', "post_id = '$req[1]' AND user_id = '$req[2]'"));
                }
                break;


            case 'unlikePost':
                if (count($req) > 1) {
                    echo json_encode($global->delete('likes', "post_id = '$req[1]' AND user_id = '$req[2]'"));
                }
                break;

            case 'checkBookmark':
                if (count($req) > 1) {
                    echo json_encode($get->get_common('favorites', "post_id = '$req[1]' AND user_id = '$req[2]'"));
                }
                break;

            case 'getLikesNumber':
                if (count($req) > 1) {
                    echo json_encode($get->getLikesNumber('likes', "post_id = '$req[1]'"));
                }
                break;

            case 'getPostData':
                if (count($req) > 1) {
                    echo json_encode($get->getPosts("WHERE posts.id = '$req[1]'"));
                }
                break;

            case 'checkLiked':
                if (count($req) > 1) {
                    echo json_encode($get->get_common('likes', "post_id = '$req[1]' AND user_id = '$req[2]'"));
                }
                break;


            case 'deleteComment':
                if (count($req) > 1) {
                    echo json_encode($global->delete('comments', "id = '$req[1]'"));
                }
                break;

            default:
                echo "request not found";
                break;
        }
        break;
    default:
        echo "failed request";
        break;
}
