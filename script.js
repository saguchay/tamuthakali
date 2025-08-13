// DOM elements
const menuGrid = document.getElementById('menuGrid');
const categoryBtns = document.querySelectorAll('.category-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

// Menu data will be loaded from menu.json
let menuData = {};

// Fetch menu data from JSON file
async function fetchMenuData() {
    try {
        const response = await fetch('menu.json');
        if (!response.ok) {
            throw new Error('Failed to fetch menu data');
        }
        menuData = await response.json();
        loadMenuItems();
    } catch (error) {
        console.error('Error loading menu data:', error);
        menuGrid.innerHTML = '<p class="error">Failed to load menu. Please try again later.</p>';
    }
}

// Load menu items
function loadMenuItems(category = 'all') {
    menuGrid.innerHTML = '';
    
    // If menuData hasn't loaded yet, return
    if (Object.keys(menuData).length === 0) return;
    
    Object.entries(menuData).forEach(([cat, items]) => {
        if (category === 'all' || category === cat) {
            items.forEach(item => {
                const foodCard = createFoodCard(item, cat);
                menuGrid.appendChild(foodCard);
            });
        }
    });
}

// Create food card element
function createFoodCard(item, category) {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.dataset.category = category;
    card.dataset.id = item.id;
    
    card.innerHTML = `
        <div class="card-image">
            <img src="https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title)}" alt="${item.title}">
        </div>
        <div class="card-content">
            <h3>${item.title}</h3>
            <p>${item.shortDescription}</p>
            <button class="btn btn-view-details" data-id="${item.id}">View Details</button>
        </div>
    `;
    
    return card;
}

// Show product details in modal
function showProductDetails(productId) {
    // Find the product in menuData
    let product = null;
    let category = null;
    
    for (const [cat, items] of Object.entries(menuData)) {
        const found = items.find(item => item.id === productId);
        if (found) {
            product = found;
            category = cat;
            break;
        }
    }
    
    if (product) {
        modalContent.innerHTML = `
            <div class="modal-image">
                <img src="https://via.placeholder.com/800x600?text=${encodeURIComponent(product.title)}" alt="${product.title}">
            </div>
            <div class="modal-details">
                <h2>${product.title}</h2>
                <p>${product.fullDescription}</p>
                
                <div class="features">
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="price">${product.price}</div>
                <button class="btn">Add to Order</button>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Event Listeners
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadMenuItems(btn.dataset.category);
    });
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-view-details')) {
        const productId = e.target.dataset.id;
        showProductDetails(productId);
    }
});

closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Initialize
fetchMenuData();