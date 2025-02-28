document.getElementById("order-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const date = document.getElementById("date").value;

    // تحقق من القيم قبل الإرسال
    console.log({ name, address, phone, email, notes, date });

    if (!name || !address || !phone || !email || !date) {
        alert("All fields are required!");
        return;
    }

    const orderData = { name, address, phone, email, notes, date };

    fetch('../myphp/place_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.href = "../myhtml/cart.html";
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});
