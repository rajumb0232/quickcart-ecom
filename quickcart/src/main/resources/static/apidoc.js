// Configuration
const CONFIG = {
    API_ENDPOINT: '/docs/fetch',
    STORAGE_KEY: 'quickcart_api_docs',
    TIMESTAMP_KEY: 'quickcart_api_docs_timestamp'
};

// Global state
let apiData = null;
let currentCategoryId = null;
let currentEndpointId = null;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const categoryList = document.getElementById('categoryList');
const contentBody = document.getElementById('contentBody');
const refreshBtn = document.getElementById('refreshBtn');
const refreshIcon = document.getElementById('refreshIcon');
const lastUpdatedText = document.getElementById('lastUpdatedText');

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    parseUrlAndRender();

    // Handle browser back/forward
    window.addEventListener('hashchange', parseUrlAndRender);

    // Mobile sidebar toggle
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', toggleMobileSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleMobileSidebar);
    }
});

// Load data from localStorage or API
async function loadData(forceRefresh = false) {
    try {
        // Try localStorage first
        if (!forceRefresh) {
            const cached = localStorage.getItem(CONFIG.STORAGE_KEY);
            const timestamp = localStorage.getItem(CONFIG.TIMESTAMP_KEY);

            if (cached && timestamp) {
                apiData = JSON.parse(cached);
                updateLastUpdatedTime(parseInt(timestamp));
                renderSidebar();
                return;
            }
        }

        // Fetch from API
        setRefreshButton(true);
        const response = await fetch(CONFIG.API_ENDPOINT);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Check if API call was successful
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch data');
        }

        const data = result.data;

        // Sort categories by display_order
        data.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));

        // Sort endpoints within each category
        data.forEach(category => {
            if (category.endpoints && category.endpoints.length > 0) {
                category.endpoints.sort((a, b) =>
                    (a.display_order ?? 999) - (b.display_order ?? 999)
                );
            }
        });

        apiData = data;

        // Save to localStorage
        const timestamp = Date.now();
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(CONFIG.TIMESTAMP_KEY, timestamp.toString());

        updateLastUpdatedTime(timestamp);
        renderSidebar();

    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load API documentation. Please try refreshing.');
    } finally {
        setRefreshButton(false);
    }
}

// Refresh data on demand
async function refreshData() {
    await loadData(true);
    parseUrlAndRender(); // Re-render current view
}

// Set refresh button state
function setRefreshButton(isLoading) {
    if (refreshBtn && refreshIcon) {
        refreshBtn.disabled = isLoading;
        if (isLoading) {
            refreshIcon.classList.add('spinning');
        } else {
            refreshIcon.classList.remove('spinning');
        }
    }
}

// Update last updated time display
function updateLastUpdatedTime(timestamp) {
    if (!lastUpdatedText) return;

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    let timeStr;
    if (diff < 60000) { // Less than 1 minute
        timeStr = 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const mins = Math.floor(diff / 60000);
        timeStr = `${mins} min${mins > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        timeStr = date.toLocaleDateString();
    }

    lastUpdatedText.textContent = `Updated ${timeStr}`;
}

// Parse URL hash and render appropriate content
function parseUrlAndRender() {
    const hash = window.location.hash.substring(1); // Remove #

    if (!hash) {
        showEmptyState();
        return;
    }

    // Expected format: category/{categoryId}/endpoint/{endpointId}
    const parts = hash.split('/');

    if (parts.length === 4 && parts[0] === 'category' && parts[2] === 'endpoint') {
        currentCategoryId = parts[1];
        currentEndpointId = parts[3];
        renderContent(currentCategoryId, currentEndpointId);
    } else {
        showEmptyState();
    }
    closeMobileSidebar(); // Close sidebar after navigation on mobile
}

// Render sidebar
function renderSidebar() {
    if (!categoryList) return;

    if (!apiData || apiData.length === 0) {
        categoryList.innerHTML = '<div class="endpoint-empty">No categories available</div>';
        return;
    }

    categoryList.innerHTML = apiData.map(category => `
        <div class="category-item">
            <div class="category-header ${currentCategoryId === category.category_id ? 'active' : ''}"
                 data-category-id="${category.category_id}"
                 onclick="toggleCategory('${category.category_id}')">
                <span class="category-toggle" id="toggle-${category.category_id}">▶</span>
                <span class="category-name">${escapeHtml(category.name)}</span>
            </div>

            <div class="endpoint-list" id="endpoints-${category.category_id}">
                ${renderEndpoints(category)}
            </div>
            <hr class="category-item-br">
        </div>
    `).join('');

    // Auto-expand active category
    if (currentCategoryId) {
        expandCategory(currentCategoryId);
    }
}

// Render endpoints for a category
function renderEndpoints(category) {
    if (!category.endpoints || category.endpoints.length === 0) {
        return `<div class="endpoint-empty">No APIs under ${escapeHtml(category.name)}</div>`;
    }

    return category.endpoints.map(endpoint => {
        const method = endpoint.method ? endpoint.method.toUpperCase() : 'GET';
        const methodClass = method.toLowerCase();

        return `
            <a href="#category/${category.category_id}/endpoint/${endpoint.endpoint_id}"
               class="endpoint-item ${currentEndpointId === endpoint.endpoint_id ? 'active' : ''}"
               onclick="navigateToEndpoint('${category.category_id}', '${endpoint.endpoint_id}', event)">
                <span class="method-badge method-${methodClass}">${method}</span>
                <span class="endpoint-title">${escapeHtml(endpoint.title)}</span>
            </a>
        `;
    }).join('');
}

// Navigate to endpoint
// Navigate to endpoint
function navigateToEndpoint(categoryId, endpointId, event) {
    event.preventDefault();
    window.location.hash = `category/${categoryId}/endpoint/${endpointId}`;

    // Close mobile sidebar after navigation
    closeMobileSidebar();

    // Clear search if active
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        searchInput.value = '';
        resetSearch();
    }
}

// Toggle category expansion
function toggleCategory(categoryId) {
    const endpointList = document.getElementById(`endpoints-${categoryId}`);
    const toggleIcon = document.getElementById(`toggle-${categoryId}`);

    if (endpointList && toggleIcon) {
        if (endpointList.classList.contains('expanded')) {
            endpointList.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        } else {
            endpointList.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        }
    }
}

// Expand a specific category
function expandCategory(categoryId) {
    const endpointList = document.getElementById(`endpoints-${categoryId}`);
    const toggleIcon = document.getElementById(`toggle-${categoryId}`);

    if (endpointList && toggleIcon) {
        endpointList.classList.add('expanded');
        toggleIcon.classList.add('expanded');
    }
}

// Collapse a specific category
function collapseCategory(categoryId) {
    const endpointList = document.getElementById(`endpoints-${categoryId}`);
    const toggleIcon = document.getElementById(`toggle-${categoryId}`);

    if (endpointList && toggleIcon) {
        endpointList.classList.remove('expanded');
        toggleIcon.classList.remove('expanded');
    }
}

// Render content area
function renderContent(categoryId, endpointId) {
    if (!apiData) {
        showError('No data available');
        return;
    }

    const category = apiData.find(cat => cat.category_id === categoryId);

    if (!category) {
        showError('Category not found');
        return;
    }

    const endpoint = category.endpoints?.find(ep => ep.endpoint_id === endpointId);

    if (!endpoint) {
        showError('Endpoint not found');
        return;
    }

    // Update content
    if (contentBody) {
        contentBody.innerHTML = `
            <div class="html-content">
                ${endpoint.content}
            </div>
        `;
        contentBody.scrollTop = 0;

        // Apply syntax highlighting to all code blocks
        if (window.hljs) {
            contentBody.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }

    // Update sidebar highlighting
    renderSidebar();
}

// Show empty state
function showEmptyState() {
    if (contentBody) {
        contentBody.innerHTML = `
            <div class="empty-state">
                <h3>Select an endpoint</h3>
                <p>Choose an endpoint from the sidebar to view its documentation</p>
            </div>
        `;
    }

    currentCategoryId = null;
    currentEndpointId = null;
    renderSidebar();
}

// Show error state
function showError(message) {
    if (contentBody) {
        contentBody.innerHTML = `
            <div class="error-state">
                <h3>⚠️ Error</h3>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Mobile sidebar functions
function toggleMobileSidebar() {
    if (sidebar && sidebarOverlay) {
        sidebar.classList.toggle('active');
        sidebarOverlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
        document.body.classList.toggle('no-scroll'); // Prevent body scroll
    }
}

function closeMobileSidebar() {
    if (sidebar && sidebarOverlay && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarOverlay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// Add a class to body to prevent scrolling when sidebar is open on mobile
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `.no-scroll { overflow: hidden; }`;
document.head.appendChild(styleSheet);