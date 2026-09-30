//ID of the product being edited (null when adding a new product)
let editingId = null;

//Function to load products from LocalStorage and display them in the table
function loadProductTable() {
    let products = JSON.parse(localStorage.getItem('products')) || []; //Search and found products from LocalStorage
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = ''; //Clear the table before adding new products

    products.forEach(product => {
        //Create a table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>
                <div class="actions">
                    <button class="edit-btn" data-id="${product.id}">Edit</button>
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </div>
            </td>
        `;
        
        //Append the row to the table
        tableBody.appendChild(row);
    });

    //Add event listeners for edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', startEdit);
    });

    //Add event listeners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteProduct);
    });

    //Show the empty message when there are no products
    document.getElementById('emptyMessage').style.display = products.length === 0 ? 'block' : 'none';

    updateSummary(products);
}

//Function to update the summary cards (total products and total value)
function updateSummary(products) {
    const totalValue = products.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
}

// Function to add a new product
function addProduct() {
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);

    // Validate inputs
    if (!name || isNaN(price) || price <= 0) {
        alert("Please enter a valid name and price.");
        return;
    }

    //If a product is being edited, save the changes instead of adding a new one
    if (editingId !== null) {
        saveEdit(name, price);
        return;
    }

    //Create the new product with unique ID
    let products = JSON.parse(localStorage.getItem('products')) || []; // || [] is used to provide a default value in case the first part (localStorage.getItem('products')) returns null or undefined
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1, // Assign an incremental ID
        name: name,
        price: price
    };

    //Add the new product to the products array
    products.push(newProduct);

    //Save the updated array (products) to LocalStorage
    localStorage.setItem('products', JSON.stringify(products));

    //Clear the form fields
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';

    //Update the table with the new product
    loadProductTable();
}

//Function to delete a product
function deleteProduct(event) {
    const productId = parseInt(event.target.getAttribute('data-id')); // Get the product ID from the button's data attribute
    let products = JSON.parse(localStorage.getItem('products')) || [];

    //Filter out the product with the corresponding ID
    products = products.filter(product => product.id !== productId);

    // Save the updated list back to LocalStorage
    localStorage.setItem('products', JSON.stringify(products));

    //If the deleted product was being edited, leave edit mode
    if (productId === editingId) {
        cancelEdit();
    }

    // Reload the product table to reflect changes
    loadProductTable();
}

//Function to load a product into the form to edit it
function startEdit(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.id === productId);

    editingId = productId;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;

    //Switch the form to edit mode
    document.getElementById('formTitle').textContent = `Edit product #${productId}`;
    document.getElementById('addProduct').textContent = 'Save changes';
    document.getElementById('cancelEdit').style.display = 'block';
    document.getElementById('name').focus();
}

//Function to save the changes of the product being edited
function saveEdit(name, price) {
    let products = JSON.parse(localStorage.getItem('products')) || [];

    //Replace the name and price of the edited product
    products = products.map(product =>
        product.id === editingId ? { ...product, name: name, price: price } : product
    );

    localStorage.setItem('products', JSON.stringify(products));
    cancelEdit();
    loadProductTable();
}

//Function to leave edit mode and reset the form
function cancelEdit() {
    editingId = null;
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('formTitle').textContent = 'New product';
    document.getElementById('addProduct').textContent = 'Add Product';
    document.getElementById('cancelEdit').style.display = 'none';
}

//Event listeners for the form buttons
document.getElementById('addProduct').addEventListener('click', addProduct);
document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

//Load products when the page loads
loadProductTable();
