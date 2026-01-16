document.addEventListener('DOMContentLoaded', () => {
    const serviceListDiv = document.getElementById('service-list');
    const addServiceForm = document.getElementById('add-service-form');
    const serviceNameInput = document.getElementById('service-name');
    const servicePriceInput = document.getElementById('service-price');
    const serviceDiscountInput = document.getElementById('service-discount');
    const serviceDescriptionInput = document.getElementById('service-description');
    const printButton = document.getElementById('print-button');
    const submitServiceBtn = document.getElementById('submit-service-btn');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const formTitle = document.getElementById('form-title');
    const editingIndexInput = document.getElementById('editing-index');

    const orderItemsTableBody = document.getElementById('order-items');
    const orderTotalSpan = document.getElementById('order-total-price');
    const orderEmptyMessage = document.getElementById('order-empty-message');

    let services = [];
    let order = [];

    // Initial dummy services (10 services in USD)
    const initialServices = [
        { name: 'ម៉ាស្សាប្រេង', price: 15.00, discount: 0, description: 'ការម៉ាស្សាប្រេងបន្ធូរអារម្មណ៍រយៈពេល 60 នាទី' },
        { name: 'ម៉ាស្សាថ្ម', price: 25.00, discount: 0, description: 'ការម៉ាស្សាថ្មក្តៅ ដើម្បីបន្ធូរសាច់ដុំ' },
        { name: 'ម៉ាស្សាជើង', price: 10.00, discount: 0, description: 'ការម៉ាស្សាជើងរយៈពេល 30 នាទី' },
        { name: 'ម៉ាស្សាស្មា', price: 12.00, discount: 0, description: 'ម៉ាស្សាស្មា និងក្បាលរយៈពេល 30 នាទី' },
        { name: 'ម៉ាស្សាមុខ', price: 20.00, discount: 0, description: 'ការម៉ាស្សាមុខបន្ធូរអារម្មណ៍' },
        { name: 'ម៉ាស្សាខ្លួន', price: 30.00, discount: 0, description: 'ការម៉ាស្សាខ្លួនពេញមួយម៉ោង' },
        { name: 'ម៉ាស្សាខ្មែរ', price: 22.00, discount: 0, description: 'ម៉ាស្សាខ្មែរបុរាណជាមួយបច្ចេកទេសពិសេស' },
        { name: 'សម្អាតមុខ', price: 18.00, discount: 0, description: 'សម្អាតមុខយ៉ាងជ្រៅ' },
        { name: 'ថែរក្សាដៃជើង', price: 28.00, discount: 0, description: 'ថែរក្សាដៃ និងជើង រួមទាំងការលាប' },
        { name: 'ដកសក់', price: 8.00, discount: 0, description: 'សេវាកម្មដកសក់តំបន់តូចៗ' }
    ];

    // Function to load services from Local Storage
    const loadServices = () => {
        const storedServices = localStorage.getItem('spaServices');
        if (storedServices) {
            services = JSON.parse(storedServices);
        } else {
            services = initialServices;
            saveServices();
        }
        renderServices();
    };

    // Function to save services to Local Storage
    const saveServices = () => {
        localStorage.setItem('spaServices', JSON.stringify(services));
    };

    // Function to load order from Local Storage
    const loadOrder = () => {
        const storedOrder = localStorage.getItem('spaOrder');
        if (storedOrder) {
            order = JSON.parse(storedOrder);
            renderOrder();
        }
    };

    // Function to save order to Local Storage
    const saveOrder = () => {
        localStorage.setItem('spaOrder', JSON.stringify(order));
    };

    // Function to render services
    const renderServices = () => {
        serviceListDiv.innerHTML = ''; // Clear current list
        services.forEach((service, index) => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p class="price">តម្លៃ: ${service.price.toFixed(2)} USD</p>
                <p class="discount">បញ្ចុះតម្លៃ: ${Number(service.discount || 0).toFixed(2)}%</p>
                <div style="margin-top:8px;">
                    <button class="btn add-to-order-btn" data-index="${index}" data-name="${service.name}" data-price="${service.price}" data-discount="${service.discount}" data-description="${service.description}">បន្ថែមទៅបញ្ជី</button>
                    <button class="btn edit-service-btn" data-index="${index}" style="margin-left:8px;">កែសម្រួល</button>
                </div>
            `;
            serviceListDiv.appendChild(serviceItem);
        });
        attachAddToOrderListeners();
        attachEditServiceListeners();
    };

    // Function to attach event listeners to "Add to Order" buttons
    const attachAddToOrderListeners = () => {
        document.querySelectorAll('.add-to-order-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.currentTarget.dataset.name;
                const price = parseFloat(e.currentTarget.dataset.price);
                const description = e.currentTarget.dataset.description;
                const discount = parseFloat(e.currentTarget.dataset.discount) || 0;
                addServiceToOrder({ name, price, description, discount });
            });
        });
    };

    // Function to attach event listeners to "Edit" buttons
    const attachEditServiceListeners = () => {
        document.querySelectorAll('.edit-service-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                startEditingService(idx);
            });
        });
    };

    // Start editing a service (populate form)
    const startEditingService = (index) => {
        const svc = services[index];
        serviceNameInput.value = svc.name;
        servicePriceInput.value = svc.price;
        serviceDiscountInput.value = svc.discount || 0;
        serviceDescriptionInput.value = svc.description || '';
        editingIndexInput.value = index;
        submitServiceBtn.textContent = 'បន្ទាន់សម័យសេវាកម្ម';
        cancelEditButton.style.display = 'inline-block';
        formTitle.textContent = 'កែសម្រួលសេវាកម្ម';
        window.scrollTo({ top: addServiceForm.offsetTop - 20, behavior: 'smooth' });
    };

    // Cancel editing
    cancelEditButton.addEventListener('click', () => {
        resetFormState();
    });

    const resetFormState = () => {
        addServiceForm.reset();
        editingIndexInput.value = '';
        submitServiceBtn.textContent = 'បន្ថែមសេវាកម្ម';
        cancelEditButton.style.display = 'none';
        formTitle.textContent = 'បន��ថែមសេវាកម្មថ្មី';
    };

    // Function to add a service to the order
    const addServiceToOrder = (serviceToAdd) => {
        const existingItemIndex = order.findIndex(item => item.name === serviceToAdd.name);

        if (existingItemIndex > -1) {
            order[existingItemIndex].quantity += 1;
        } else {
            order.push({ ...serviceToAdd, quantity: 1 });
        }
        saveOrder();
        renderOrder();
    };

    // Function to remove a service from the order
    const removeOrderItem = (serviceName) => {
        order = order.filter(item => item.name !== serviceName);
        saveOrder();
        renderOrder();
    };

    // Function to render the order list
    const renderOrder = () => {
        orderItemsTableBody.innerHTML = ''; // Clear current order list
        if (order.length === 0) {
            orderEmptyMessage.style.display = 'block';
            orderItemsTableBody.style.display = 'none';
        } else {
            orderEmptyMessage.style.display = 'none';
            orderItemsTableBody.style.display = 'table-row-group';
            order.forEach(item => {
                const row = document.createElement('tr');
                const discountedUnitPrice = item.price * (1 - (item.discount || 0) / 100);
                const itemTotal = discountedUnitPrice * item.quantity;
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.discount || 0).toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${itemTotal.toFixed(2)}</td>
                    <td><button class="btn remove-item-btn" data-name="${item.name}">លុបចេញ</button></td>
                `;
                orderItemsTableBody.appendChild(row);
            });
            attachRemoveItemListeners();
        }
        calculateOrderTotal();
    };

    // Function to attach event listeners to "Remove Item" buttons
    const attachRemoveItemListeners = () => {
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.currentTarget.dataset.name;
                removeOrderItem(name);
            });
        });
    };

    // Function to calculate and display the total order price
    const calculateOrderTotal = () => {
        const total = order.reduce((sum, item) => {
            const discountedUnitPrice = item.price * (1 - (item.discount || 0) / 100);
            return sum + (discountedUnitPrice * item.quantity);
        }, 0);
        orderTotalSpan.textContent = total.toFixed(2);
    };

    // Event listener for adding/updating a service
    addServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = serviceNameInput.value.trim();
        const price = parseFloat(servicePriceInput.value);
        const discount = parseFloat(serviceDiscountInput.value) || 0;
        const description = serviceDescriptionInput.value.trim();

        if (name && !isNaN(price) && price > 0 && discount >= 0 && discount <= 100) {
            const editingIndex = editingIndexInput.value;
            if (editingIndex !== '') {
                // Update existing service
                const idx = parseInt(editingIndex, 10);
                const oldName = services[idx].name;
                services[idx] = { name, price, discount, description };
                saveServices();

                // Update order items that reference this service by old name
                order = order.map(item => {
                    if (item.name === oldName) {
                        return { ...item, name, price, discount };
                    }
                    return item;
                });
                saveOrder();

                resetFormState();
                renderServices();
                renderOrder();
            } else {
                // Add new service
                services.push({ name, price, discount, description });
                saveServices();
                renderServices();
                addServiceForm.reset(); // Clear the form
            }
        } else {
            alert('សូមបញ្ចូលឈ្មោះសេវាកម្ម តម្លៃ និងបញ្ចុះតម្លៃត្រឹមត្រូវ។ (discount 0-100%)');
        }
    });

    // Event listener for print button
    printButton.addEventListener('click', () => {
        window.print();
    });

    // Initial loads
    loadServices();
    loadOrder();
});
