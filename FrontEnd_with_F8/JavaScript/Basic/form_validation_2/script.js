// Tạo một đối tượng XMLHttpRequest
var xhr = new XMLHttpRequest();

// Đặt phương thức và URL của yêu cầu
xhr.open('GET', 'data.php', true);

// Xử lý sự kiện khi yêu cầu hoàn thành
xhr.onload = function() {
  if (xhr.status === 200) {
    // Lấy nội dung từ phản hồi
    var fileContent = xhr.responseText;

    // Hiển thị nội dung trên trang
    var contentElement = document.getElementById('content');
    contentElement.innerText = fileContent;
  }
};

// Gửi yêu cầu
xhr.send();