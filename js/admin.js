document.addEventListener("DOMContentLoaded", function () {
    const addProductBtn = document.getElementById('add-product-btn');
    const deleteProductBtn = document.getElementById('delete-product-btn');
    const viewOrdersBtn = document.getElementById('view-orders-btn');
    const addProductForm = document.getElementById('add-product-form');
    const deleteProductTable = document.getElementById('delete-product-table');
    const viewOrdersTable = document.getElementById('view-orders-table'); // الجدول لعرض الطلبات

    // التعامل مع الضغط على الأزرار
    addProductBtn.addEventListener('click', function () {
        addProductForm.style.display = toggleDisplay(addProductForm.style.display); // إظهار/إخفاء نموذج إضافة المنتج
    });

    deleteProductBtn.addEventListener('click', function () {
        deleteProductTable.style.display = toggleDisplay(deleteProductTable.style.display); // إظهار/إخفاء جدول حذف المنتجات
        if (deleteProductTable.style.display === 'block') {
            fetch('../myphp/get_books.php')
                .then(response => response.text())
                .then(data => {
                    document.querySelector('#delete-product-table tbody').innerHTML = data;
                    attachDeleteEvents();
                });
        }
    });

    // عند الضغط على زر "عرض الطلبات"
    viewOrdersBtn.addEventListener('click', function () {
        viewOrdersTable.style.display = toggleDisplay(viewOrdersTable.style.display); // إظهار/إخفاء جدول عرض الطلبات
        if (viewOrdersTable.style.display === 'block') {
            // تحميل الطلبات من قاعدة البيانات عبر AJAX
            fetch('../myphp/get_orders.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const orders = data.orders;
                        let rows = '';
                        orders.forEach(order => {
                            rows += `
                                <tr>
                                    <td>${order.name}</td>
                                    <td>${order.date}</td>
                                     <td>${order.email}</td>
                                    <td>${order.address}</td>
                                    <td>${order.phone}</td>
                                    <td>${order.notes ? order.notes : 'N/A'}</td>
                                </tr>
                            `;
                        });
                        // إضافة البيانات إلى الجدول
                        document.querySelector('#view-orders-table tbody').innerHTML = rows;
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });

    // دالة لإضافة أحداث الحذف لجميع الأزرار
    function attachDeleteEvents() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const bookId = this.getAttribute('data-id'); // الحصول على ID الكتاب من الزر
                const row = this.closest('tr'); // تحديد الصف الذي يحتوي على الزر
                if (!bookId) {
                    alert("No book ID found for this row!");
                    return;
                }
                fetch('../myphp/delete_book.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `book_id=${bookId}`
                })
                    .then(response => response.text())
                    .then(result => {
                        if (result.includes("success")) {
                            row.remove();
                        } else {
                            alert("Error: " + result);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            });
        });
    }

    // دالة لتبديل العرض بين block و none
    function toggleDisplay(currentDisplay) {
        return currentDisplay === 'block' ? 'none' : 'block';
    }
});
