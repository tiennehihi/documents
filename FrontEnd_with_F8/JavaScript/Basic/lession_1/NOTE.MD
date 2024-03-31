1. Em có nắm rõ khái niệm Promise không ?
        Có, Promise là 1 khái niệm sinh ra để giúp chúng ta xử lý các thao tác bất đồng bộ,
    trước khi có Promise chúng ta thường sử dụng callback, 
    callback sẽ xảy ra vấn đề là callback hell nó sẽ bị sâu vào rất khó nhìn code bị rối khó hiểu
    cho nên Promise được sinh ra từ phiên bản Javasript mới hơn trong phiên bản ES6 và chúng ta sử dụng nó để
    khắc phục tình trạng callback hell để giúp chúng ta viết code không bị sâu vào dễ đọc dễ hiểu hơn
        Để tạo ra promise chúng ta sẽ sử dụng từ khóa 'new' với 'Promise' và trong constructor của nó chúng ta sẽ 
    truyền vào 1 'Executor function()' khi Executor thực thi trong 'Executor function()' sẽ nhận được 2 tham số dạng hàm 'resolve()' và 'reject()'
    reslove() chúng ta sẽ gọi nó khi thao tác logic xử lý thành công
    reject() chúng ta sẽ gọi nó khi thao tác logic xử lý thất bại
        Và khi chúng ta sử dụng Promise(), đối tượng promise sẽ được tạo ra, chúng ta sẽ sử dụng qua những phương thức 
    là 'then()' hoặc 'catch()'. 
        '.then()' và '.catch()' đều nhận 'callback function()' và sẽ được thực thi vào 'then()' nếu promise của chúng ta đựơc 'resolve()'
    hoặc thực thi vào 'catch()' nếu promise của chúng ta 'reject()'



Promise có 3 trạng thái:
    - Pending: trạng thái chờ thành công hay thất bại
    - Fulfilled: thành công
    - Rejected: thất bại

npm: node packet mananger 