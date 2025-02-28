window.addEventListener("DOMContentLoaded", function() {
    fetch('../myphp/check_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                loadCart();
            } else {
                alert("You need to log in to view your cart.");

            }
        })
        .catch(error => console.error('Error:', error));
});

function loadCart() {
    fetch('../myphp/get_cart.php')
        .then(response => response.json())
        .then(data => {
            if (data.cart && data.cart.length > 0) {
                displayCart(data.cart);
            } else {
                document.querySelector(".cart-container tbody").innerHTML = "<tr><td colspan='5'>Your cart is empty!</td></tr>";
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayCart(cart) {
    const tbody = document.querySelector(".cart-container tbody");
    tbody.innerHTML = '';

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        // حساب المجموع لكل قطعة (القطعة * الكمية)
        const itemTotal = item.price * item.quantity;

        // تحديث السعر الإجمالي للمنتج (تحديث الـ total لكل عنصر)
        item.total = itemTotal;

        const row = document.createElement('tr');
        row.classList.add('cart-item');
        row.id = `cart-item-${item.book_id}`;

        const rowHTML = `
            <td>
                <div class="book-info">
                    <img src="${item.image_url}" alt="${item.book_title}" class="book-image">
                    <span class="book-title">${item.book_title}</span>
                </div>
            </td>
            <td>${item.price}$</td>
            <td><input type="number" value="${item.quantity}" min="1" class="quantity" onchange="updateQuantity(${item.book_id}, this)"></td>
            <td class="total-price">${item.total.toFixed(2)}$</td>
            <td><button class="remove-btn" onclick="removeFromCart(${item.book_id})">Remove</button></td>
        `;

        row.innerHTML = rowHTML;
        tbody.appendChild(row);

        // إضافة الكمية إلى totalItems (عدد العناصر)
        totalItems += item.quantity;

        // إضافة المجموع الكلي للمنتجات إلى totalPrice
        totalPrice += item.total; // نستخدم هنا item.total وليس item.price * item.quantity لأنه تم حسابه في الأعلى
    });

    // تحديث ملخص السلة
    document.getElementById('total-items-summary').textContent = totalItems;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}


// تحديث الكمية في السلة عبر AJAX
function updateQuantity(bookId, inputElement) {
    const newQuantity = inputElement.value;

    // تحديث السعر الإجمالي في السلة
    fetch('../myphp/update_quantity.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            book_id: bookId,
            quantity: newQuantity
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // إعادة تحميل السلة بعد التحديث
                loadCart();
            } else {
                alert('Error updating quantity');
            }
        })
        .catch(error => console.error('Error:', error));
}



function recalculateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').value, 10);
        const total = parseFloat(item.querySelector('.total-price').textContent.replace('$', ''));

        totalItems += quantity;
        totalPrice += total;
    });

    // Update the cart summary
    document.getElementById('total-items-summary').textContent = totalItems;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear the container before adding

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" class="quantity-input" value="${item.quantity}" data-id="${item.id}" min="1" />
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    // Update the cart summary
    document.getElementById('total-items-summary').textContent = totalItems;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}
function removeFromCart(bookId) {
    fetch('../myphp/remove_from_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: bookId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById(`cart-item-${bookId}`).remove();
                recalculateCart(); // Recalculate after removal
            } else {
                alert('Failed to remove book from cart!');
            }
        })
        .catch(error => console.error('Error:', error));
}
