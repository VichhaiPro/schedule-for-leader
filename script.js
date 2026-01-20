document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = [];
    let products = [
        // Services - Surgery Spa Salon (Khmer names)
        { id: 1, name: 'ការវះកាត់កែសម្ផស្សច្រមុះ', price: 1500.00, discountPercentage: 10 }, // Rhinoplasty
        { id: 2, name: 'ការវះកាត់បំបាត់ស្នាមជ្រីវជ្រួញ', price: 2500.00, discountPercentage: 10 }, // Facelift
        { id: 3, name: 'ការបូមខ្លាញ់', price: 3000.00, discountPercentage: 10 }, // Liposuction
        { id: 4, name: 'ការចាក់បូថុលីញ៉ូម', price: 300.00, discountPercentage: 10 }, // Botox Injection
        { id: 5, name: 'ការចាក់បំពេញស្បែក', price: 500.00, discountPercentage: 10 }, // Dermal Fillers
        { id: 6, name: 'ការព្យាបាលដោយឡាស៊ែរស្បែក', price: 400.00, discountPercentage: 10 }, // Laser Skin Resurfacing
        { id: 7, name: 'ការថែរក្សាផ្ទៃមុខស្ប៉ា', price: 80.00, discountPercentage: 10 }, // Spa Facial Treatment
        { id: 8, name: 'ការម៉ាស្សាសម្រាកកាយ', price: 60.00, discountPercentage: 10 }, // Relaxation Massage
        { id: 9, name: 'ការធ្វើក្រចកដៃជើង', price: 40.00, discountPercentage: 10 }, // Manicure & Pedicure
        { id: 10, name: 'ការដកសក់ដោយឡាស៊ែរ', price: 200.00, discountPercentage: 10 } // Laser Hair Removal
    ];

    function calculateDiscountedPrice(itemOrProduct) {
        const discount = itemOrProduct.discountPercentage !== undefined ? itemOrProduct.discountPercentage : 0;
        return itemOrProduct.price * (1 - (discount / 100));
    }

    function renderProducts() {
        productList.innerHTML = '';
        products.forEach(product => {
            const discountedPrice = calculateDiscountedPrice(product);
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p class="original-price"><s>$${product.price.toFixed(2)}</s></p>
                <p class="discounted-price">$${discountedPrice.toFixed(2)} (${product.discountPercentage}% off)</p>
                <button data-id="${product.id}">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        });
    }

    function renderCart() {
        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemDiscount = item.discountPercentage !== undefined ? item.discountPercentage : 0;
                const discountedPrice = calculateDiscountedPrice(item);
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div>
                        <span>${item.name} x ${item.quantity}</span><br>
                        <span>$${(discountedPrice * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="discount-input-container">
                        <input type="number" min="0" max="100" value="${itemDiscount}" data-id="${item.id}" class="item-discount-input"> %
                    </div>
                `;
                cartItems.appendChild(cartItemDiv);
            });
            addDiscountInputListeners(); // Add listeners after rendering
        }
        updateCartTotal();
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (calculateDiscountedPrice(item) * item.quantity), 0);
        cartTotalSpan.textContent = total.toFixed(2);
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingCartItem = cart.find(item => item.id === productId);
            if (existingCartItem) {
                existingCartItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1, discountPercentage: product.discountPercentage }); // Copy initial discount
            }
            renderCart();
        }
    }

    function updateCartItemDiscount(productId, newDiscount) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            let discount = parseFloat(newDiscount);
            if (isNaN(discount) || discount < 0) discount = 0;
            if (discount > 100) discount = 100;
            cartItem.discountPercentage = discount;
            renderCart();
        }
    }

    function addDiscountInputListeners() {
        document.querySelectorAll('.item-discount-input').forEach(input => {
            input.addEventListener('change', (event) => {
                const productId = parseInt(event.target.dataset.id);
                updateCartItemDiscount(productId, event.target.value);
            });
        });
    }

    // Locate the cart-section to add the customer name input
    const cartSection = document.getElementById('cart-section');
    const cartSummary = document.getElementById('cart-summary');

    // Create and insert the customer name input field
    const customerNameContainer = document.createElement('div');
    customerNameContainer.innerHTML = `
        <div class="customer-name-input-container">
            <label for="customer-name">Customer Name:</label>
            <input type="text" id="customer-name" placeholder="Enter customer name">
        </div>
    `;
    cartSection.insertBefore(customerNameContainer, cartSummary);

    function generateReceiptContent(currentCart, finalTotal, customerName = '') { // Added customerName parameter
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        let itemsHtml = currentCart.map(item => {
            const originalItemPrice = item.price * item.quantity;
            const discountedItemPrice = calculateDiscountedPrice(item) * item.quantity;
            const discountAmount = originalItemPrice - discountedItemPrice;
            return `
                <div class="receipt-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${originalItemPrice.toFixed(2)}</span>
                    ${item.discountPercentage > 0 ? `<span class="discount-line">(-${item.discountPercentage}%) -$${discountAmount.toFixed(2)}</span>` : ''}
                    <span class="final-price">$${discountedItemPrice.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Corrected subtotal calculation
        const totalDiscount = subtotal - parseFloat(finalTotal);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt</title>
                <style>
                    body { font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; line-height: 1.4; width: 400px; margin: 0 auto; padding: 15px; box-sizing: border-box; } /* Increased width to 400px */
                    .header, .footer { text-align: center; margin-bottom: 15px; }
                    .header h2 { margin: 0; font-size: 1.4em; }
                    .header p { margin: 2px 0; }
                    .separator { border-top: 1px dashed #000; margin: 10px 0; }
                    .item-list { padding: 10px 0; margin-bottom: 15px; }
                    .receipt-item { display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 8px; } /* Allow wrapping */
                    .receipt-item span { flex-basis: auto; /* Allow content to dictate initial size */ }
                    .receipt-item span:nth-child(1) { flex-grow: 2; text-align: left; padding-right: 5px; } /* Name and quantity, takes more space */
                    .receipt-item span:nth-child(2) { flex-grow: 1; text-align: right; padding-left: 5px; } /* Original price */
                    .discount-line { color: #888; font-size: 0.9em; text-align: right; flex-grow: 1; padding-left: 5px; }
                    .receipt-item .final-price { font-weight: bold; text-align: right; flex-grow: 1; padding-left: 5px; }
                    .summary { margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; }
                    .summary div { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .summary div span:first-child { text-align: left; }
                    .summary div span:last-child { text-align: right; }
                    .total { font-size: 1.3em; font-weight: bold; padding-top: 5px; border-top: 1px solid #000; margin-top: 10px; }
                    .total span:first-child { text-transform: uppercase; }
                    .footer p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <div id="receipt-capture">
                    <div class="header">
                        <h2>Surgery Clinic SPA</h2> <!-- Updated store name -->
                        <p>កាលបរិច្ឆេទ: ${date}</p>
                        <p>ម៉ោង: ${time}</p>
                        ${customerName ? `<p>អតិថិជន: ${customerName}</p>` : ''} <!-- Added customer name -->
                        <p>-----------------------------------</p>
                    </div>
                    <div class="item-list">
                        ${itemsHtml}
                    </div>
                    <div class="summary">
                        <div><span>តម្លៃសរុប:</span> <span>$${subtotal.toFixed(2)}</span></div>
                        <div><span>បញ្ចុះតម្លៃសរុប:</span> <span>-$${totalDiscount.toFixed(2)}</span></div>
                        <div class="total"><span>សរុប:</span> <span>$${finalTotal}</span></div>
                    </div>
                    <div class="footer">
                        <p>-----------------------------------</p>
                        <p>អរគុណ!</p>
                    </div>
                    <!-- Removed JPG button -->
                </div>
            </body>
            </html>
        `;
    }

    productList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const productId = parseInt(event.target.dataset.id);
            addToCart(productId);
        }
    });

    checkoutButton.addEventListener('click', async () => { // Made async for html2canvas
        if (cart.length > 0) {
            const finalTotal = cartTotalSpan.textContent;
            const customerNameInput = document.getElementById('customer-name');
            const customerName = customerNameInput ? customerNameInput.value.trim() : ''; // Get customer name

            // --- Generate and save JPG automatically ---
            const tempReceiptContainer = document.createElement('div');
            tempReceiptContainer.style.position = 'absolute';
            tempReceiptContainer.style.left = '-9999px'; // Hide it off-screen
            tempReceiptContainer.innerHTML = generateReceiptContent(cart, finalTotal, customerName); // Pass customerName
            document.body.appendChild(tempReceiptContainer);

            const receiptElement = tempReceiptContainer.querySelector('#receipt-capture');
            if (receiptElement && typeof html2canvas !== 'undefined') {
                try {
                    const canvas = await html2canvas(receiptElement, {
                        scale: 2, // Increase resolution for better quality JPG
                        width: 400, // Explicitly set width for consistent POS size
                        windowWidth: 400 // Also set windowWidth for consistent rendering
                    });
                    const image = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality
                    const link = document.createElement('a');
                    link.download = `receipt_${customerName.replace(/[^a-zA-Z0-9]/g, '_') || 'customer'}_${new Date().getTime()}.jpg`; // Dynamic filename
                    link.href = image;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error('Error generating receipt JPG:', error);
                    alert('Could not save receipt as JPG. Check console for details.');
                }
            } else {
                console.error('html2canvas not loaded or receipt element not found.');
                alert('HTML2Canvas library not loaded. Cannot save as JPG.');
            }
            document.body.removeChild(tempReceiptContainer); // Clean up temporary div
            // --- End JPG generation ---


            // --- Open print-friendly receipt in new window ---
            const printReceiptHtml = generateReceiptContent(cart, finalTotal, customerName); // Pass customerName
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(printReceiptHtml);
                newWindow.document.close();
                newWindow.focus();
                // newWindow.print(); // User can manually print or print to PDF
            } else {
                alert('Please allow pop-ups for the receipt window.');
            }
            // --- End print-friendly receipt ---

            // Clear cart after checkout
            cart = [];
            renderCart();
            if (customerNameInput) customerNameInput.value = ''; // Clear customer name input
        } else {
            alert('Your cart is empty!');
        }
    });

    // Initial render
    renderProducts();
    renderCart();
});
