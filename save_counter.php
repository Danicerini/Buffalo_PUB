<?php
$data = file_get_contents('php://input');
file_put_contents('counter.json', $data);
?>
