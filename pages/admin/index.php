<?php session_start() ?>

<?php

    if(!isset($_SESSION["login"])){

        if(isset($_POST["acao"])){
            $login="admin";
            $pass="admin";

            $loginForm=$_POST['login'];
            $passForm=$_POST['pass'];

            if($loginForm == $login && $passForm == $pass){
                $_SESSION['login']=true;
                header('location: index.php');
            }else{
                echo "Dados inválidos";
            }
        }
        
        include("login.html");
    }else{
        if(isset($_GET["logout"])){
            unset($_SESSION["login"]);
            session_destroy();
            header("location: ../user/index.html");
        }else{
            include("menager.html");
        }
    }

?>