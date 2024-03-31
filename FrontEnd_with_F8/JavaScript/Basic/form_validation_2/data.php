<?php
$file = 'data.txt';
if (file_exists($file)) {
    // Đặt tiêu đề của phản hồi là văn bản thuần
    header('Content-Type: text/plain');

    // Đọc và trả về nội dung của tệp tin
    readfile($file);
} else {
    echo 'File not found.';
}
?>