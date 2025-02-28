window.addEventListener("DOMContentLoaded", function() {
    // تحقق من حالة تسجيل الدخول
    fetch('../myphp/check_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                // إذا كان المستخدم مسجل دخوله، استعرض الكتب المفضلة
                loadFavorites();
            } else {
                alert("You need to log in to view your favorites.");
                window.location.href = "../myhtml/index.html";  // إعادة توجيه إلى صفحة الدخول إذا لم يكن مسجل دخوله
            }
        })
        .catch(error => console.error('Error:', error));
});

// تحميل الكتب المفضلة للمستخدم
function loadFavorites() {
    fetch('../myphp/get_favorites.php')
        .then(response => response.json())
        .then(data => {
            console.log(data);  // إضافة سجل هنا لعرض البيانات المستلمة
            if (data.favorites && data.favorites.length > 0) {
                displayFavorites(data.favorites);
            } else {
                document.getElementById("favorites-list").innerHTML = "<p> Your wishlist is empty 👀!</p>";
            }
        })
        .catch(error => console.error('Error:', error));
}

// عرض الكتب المفضلة في واجهة المستخدم
function displayFavorites(favorites) {
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = '';  // تنظيف القائمة الحالية

    favorites.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.id = `book-${book.id}`; // تعيين معرف فريد لكل كتاب

        // إضافة الـ HTML بشكل ديناميكي مع صورة ومعلومات الكتاب
        const bookHTML = `
            <img src="${book.image_url}" alt="${book.title}" />  <!-- عرض الصورة -->
            <div class="info">
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Price: ${book.price}$</p>
            </div>
             <button class="add-to-cart" >
            Add to Cart
        </button>
            <button class="remove-from-favorites" onclick="removeFromFavorites(${book.id})">
       &times; <!-- هذه هي رمز "x" -->
       </button>\
            `;



        bookElement.innerHTML = bookHTML; // وضع المحتوى في العنصر

        favoritesList.appendChild(bookElement); // إضافة الكتاب إلى الـ DOM
    });
}
bookElement.innerHTML = bookHTML;
favoritesList.appendChild(bookElement);
// دالة إزالة كتاب من المفضلة
function removeFromFavorites(bookId) {
    fetch('../myphp/remove_from_favorites.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ book_id: bookId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // إزالة العنصر من DOM باستخدام المعرف
                const bookElement = document.getElementById(`book-${bookId}`);
                if (bookElement) {
                    bookElement.remove();
                }
            } else {
                alert('Failed to remove book from favorites!');
            }
        })
        .catch(error => console.error('Error:', error));
}
