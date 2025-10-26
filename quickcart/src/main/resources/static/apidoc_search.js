// Search functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (!apiData) return;

    // If search is empty, show everything
    if (!searchTerm) {
        resetSearch();
        return;
    }

    let hasResults = false;

    apiData.forEach(category => {
        const categoryElement = document.querySelector(`[data-category-id="${category.category_id}"]`)?.closest('.category-item');
        if (!categoryElement) return;

        let categoryHasMatch = false;
        const categoryNameMatches = category.name.toLowerCase().includes(searchTerm);

        // Check endpoints
        if (category.endpoints && category.endpoints.length > 0) {
            category.endpoints.forEach(endpoint => {
                const endpointElement = document.querySelector(`a[href="#category/${category.category_id}/endpoint/${endpoint.endpoint_id}"]`);
                if (!endpointElement) return;

                const endpointMatches = endpoint.title.toLowerCase().includes(searchTerm);

                if (endpointMatches || categoryNameMatches) {
                    endpointElement.classList.remove('hidden');
                    highlightText(endpointElement, endpoint.title, searchTerm);
                    categoryHasMatch = true;
                    hasResults = true;
                } else {
                    endpointElement.classList.add('hidden');
                    removeHighlight(endpointElement, endpoint.title);
                }
            });
        }

        // Show/hide category based on matches
        if (categoryHasMatch || categoryNameMatches) {
            categoryElement.classList.remove('hidden');
            expandCategory(category.category_id); // Auto-expand matching categories

            // Highlight category name if it matches
            const categoryNameElement = categoryElement.querySelector('.category-name');
            if (categoryNameElement && categoryNameMatches) {
                highlightText(categoryNameElement, category.name, searchTerm);
            }
            hasResults = true;
        } else {
            categoryElement.classList.add('hidden');
        }
    });

    // Show "no results" message if nothing found
    showNoResultsMessage(!hasResults);
}

function resetSearch() {
    // Remove all hidden classes
    document.querySelectorAll('.category-item.hidden, .endpoint-item.hidden').forEach(el => {
        el.classList.remove('hidden');
    });

    // Remove all highlights from endpoints
    if (apiData) {
        apiData.forEach(category => {
            if (category.endpoints && category.endpoints.length > 0) {
                category.endpoints.forEach(endpoint => {
                    const endpointElement = document.querySelector(`a[href="#category/${category.category_id}/endpoint/${endpoint.endpoint_id}"]`);
                    if (endpointElement) {
                        const titleElement = endpointElement.querySelector('.endpoint-title');
                        if (titleElement) {
                            titleElement.textContent = endpoint.title;
                        }
                    }
                });
            }

            // Collapse all categories except the current one
            if (category.category_id !== currentCategoryId) {
                collapseCategory(category.category_id);
            }
        });
    }

    // Remove highlights from category names
    document.querySelectorAll('.category-name').forEach(el => {
        const originalText = el.textContent.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
        el.textContent = originalText;
    });

    // Remove no results message
    showNoResultsMessage(false);
}

function highlightText(element, originalText, searchTerm) {
    const titleElement = element.querySelector('.endpoint-title');
    if (titleElement) {
        const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
        const highlighted = originalText.replace(regex, '<mark>$1</mark>');
        titleElement.innerHTML = highlighted;
    } else {
        // For category names
        const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
        const highlighted = originalText.replace(regex, '<mark>$1</mark>');
        element.innerHTML = highlighted;
    }
}

function removeHighlight(element, originalText) {
    const titleElement = element.querySelector('.endpoint-title');
    if (titleElement) {
        // Only restore the title element, not the whole element
        titleElement.innerHTML = originalText;
        // Remove any mark tags
        titleElement.innerHTML = titleElement.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
    } else {
        // For category names
        element.innerHTML = originalText;
        element.innerHTML = element.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
    }
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.getElementById('noResultsMessage');

    if (show) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'endpoint-empty';
            noResultsMsg.textContent = 'No matching endpoints found';
            categoryList.appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}