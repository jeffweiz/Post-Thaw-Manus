// Enhanced JavaScript with search functionality and interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Load the markdown content
    fetch('content.md')
        .then(response => response.text())
        .then(markdown => {
            // Configure marked options
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true
            });
            
            // Convert markdown to HTML
            const htmlContent = marked.parse(markdown);
            
            // Insert the HTML content
            document.getElementById('content').innerHTML = htmlContent;
            
            // Process all headings to add IDs and create section divs
            processHeadings();
            
            // Add smooth scrolling for anchor links
            addSmoothScrolling();
            
            // Add active class to navigation items based on scroll position
            addScrollSpy();
            
            // Add back to top button functionality
            addBackToTopButton();
            
            // Initialize search functionality
            initializeSearch();
            
            // Add collapsible sections
            addCollapsibleSections();
            
            // Add reading progress indicator
            addReadingProgressIndicator();
        })
        .catch(error => {
            console.error('Error loading markdown content:', error);
            document.getElementById('content').innerHTML = '<div class="alert alert-danger">Error loading content. Please try again later.</div>';
        });
});

function processHeadings() {
    const content = document.getElementById('content');
    const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Wrap sections in div elements
    let currentSection = null;
    let currentLevel = 0;
    
    headings.forEach(heading => {
        // Get heading level (h1 = 1, h2 = 2, etc.)
        const level = parseInt(heading.tagName.substring(1));
        
        // If this is a main section heading (h1 or h2)
        if (level <= 2) {
            // Create a new section
            currentSection = document.createElement('div');
            currentSection.className = 'content-section';
            currentSection.id = heading.id;
            
            // Add icon to heading based on section
            addIconToHeading(heading);
            
            // Move the heading and all following elements until the next heading into this section
            let node = heading;
            const nodesToMove = [node];
            
            while (node.nextElementSibling && 
                   (!node.nextElementSibling.tagName.match(/^H[1-2]$/i))) {
                node = node.nextElementSibling;
                nodesToMove.push(node);
            }
            
            // Remove these nodes from their current position
            nodesToMove.forEach(n => {
                if (n.parentNode === content) {
                    content.removeChild(n);
                }
            });
            
            // Add them to the new section
            nodesToMove.forEach(n => currentSection.appendChild(n));
            
            // Add the section to the content
            content.appendChild(currentSection);
            
            currentLevel = level;
        } else {
            // Add icon to sub-headings
            addIconToHeading(heading);
        }
    });
}

function addIconToHeading(heading) {
    const headingText = heading.textContent.toLowerCase();
    let iconClass = 'fas fa-info-circle';
    
    if (headingText.includes('executive summary')) {
        iconClass = 'fas fa-file-alt';
    } else if (headingText.includes('introduction')) {
        iconClass = 'fas fa-info-circle';
    } else if (headingText.includes('industry analysis')) {
        iconClass = 'fas fa-chart-line';
    } else if (headingText.includes('technical analysis')) {
        iconClass = 'fas fa-microscope';
    } else if (headingText.includes('recommendations')) {
        iconClass = 'fas fa-clipboard-check';
    } else if (headingText.includes('methuselah biologics')) {
        iconClass = 'fas fa-building';
    } else if (headingText.includes('conclusion')) {
        iconClass = 'fas fa-flag-checkered';
    } else if (headingText.includes('fraud') || headingText.includes('manipulation')) {
        iconClass = 'fas fa-exclamation-triangle';
    } else if (headingText.includes('testing') || headingText.includes('assessment')) {
        iconClass = 'fas fa-vial';
    } else if (headingText.includes('standard') || headingText.includes('practice')) {
        iconClass = 'fas fa-check-circle';
    }
    
    const icon = document.createElement('i');
    icon.className = `${iconClass} mr-2`;
    heading.insertBefore(icon, heading.firstChild);
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
                
                // Highlight the target section briefly
                targetElement.classList.add('highlight-section');
                setTimeout(() => {
                    targetElement.classList.remove('highlight-section');
                }, 1500);
            }
        });
    });
}

function addScrollSpy() {
    // Add active class to navigation items based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.content-section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all navigation items
                document.querySelectorAll('.table-of-contents a').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to current section in navigation
                const navItem = document.querySelector(`.table-of-contents a[href="#${section.id}"]`);
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
        });
    });
}

function addBackToTopButton() {
    // Create back to top button
    const backToTopButton = document.createElement('a');
    backToTopButton.href = '#';
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm.length < 3) {
            searchResults.innerHTML = '<div class="alert alert-info">Please enter at least 3 characters to search.</div>';
            return;
        }
        
        // Get all content sections
        const contentSections = document.querySelectorAll('.content-section');
        let results = [];
        
        // Search in each section
        contentSections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            const sectionId = section.id;
            const sectionHeading = section.querySelector('h1, h2, h3, h4, h5, h6');
            const sectionTitle = sectionHeading ? sectionHeading.textContent : 'Unnamed Section';
            
            if (sectionText.includes(searchTerm)) {
                // Find the context of the search term
                const index = sectionText.indexOf(searchTerm);
                const start = Math.max(0, index - 50);
                const end = Math.min(sectionText.length, index + searchTerm.length + 50);
                let context = sectionText.substring(start, end);
                
                // Add ellipsis if needed
                if (start > 0) context = '...' + context;
                if (end < sectionText.length) context += '...';
                
                // Highlight the search term
                const highlightedContext = context.replace(
                    new RegExp(searchTerm, 'gi'), 
                    match => `<span class="bg-warning">${match}</span>`
                );
                
                results.push({
                    title: sectionTitle,
                    id: sectionId,
                    context: highlightedContext
                });
            }
        });
        
        // Display results
        if (results.length > 0) {
            let resultsHTML = '<div class="list-group">';
            results.forEach(result => {
                resultsHTML += `
                    <a href="#${result.id}" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${result.title}</h6>
                        </div>
                        <small class="text-muted">${result.context}</small>
                    </a>
                `;
            });
            resultsHTML += '</div>';
            searchResults.innerHTML = resultsHTML;
        } else {
            searchResults.innerHTML = '<div class="alert alert-warning">No results found for "' + searchTerm + '".</div>';
        }
    }
    
    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function addCollapsibleSections() {
    // Add collapse/expand buttons to h3 sections
    document.querySelectorAll('h3').forEach(heading => {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn btn-sm btn-outline-secondary float-right toggle-section';
        toggleButton.innerHTML = '<i class="fas fa-minus"></i>';
        toggleButton.setAttribute('data-expanded', 'true');
        toggleButton.setAttribute('title', 'Collapse section');
        
        // Insert button into heading
        heading.appendChild(toggleButton);
        
        // Get all elements until next heading
        const content = [];
        let currentElement = heading.nextElementSibling;
        
        while (currentElement && !['H1', 'H2', 'H3'].includes(currentElement.tagName)) {
            content.push(currentElement);
            currentElement = currentElement.nextElementSibling;
        }
        
        // Add click event to toggle visibility
        toggleButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('data-expanded') === 'true';
            
            if (isExpanded) {
                // Collapse
                content.forEach(el => {
                    el.style.display = 'none';
                });
                this.innerHTML = '<i class="fas fa-plus"></i>';
                this.setAttribute('data-expanded', 'false');
                this.setAttribute('title', 'Expand section');
            } else {
                // Expand
                content.forEach(el => {
                    el.style.display = '';
                });
                this.innerHTML = '<i class="fas fa-minus"></i>';
                this.setAttribute('data-expanded', 'true');
                this.setAttribute('title', 'Collapse section');
            }
        });
    });
}

function addReadingProgressIndicator() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    // Update progress bar on scroll
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollPosition = window.scrollY;
        
        const progress = (scrollPosition / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Add CSS for new interactive features
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .highlight-section {
            animation: highlight 1.5s ease-out;
        }
        
        @keyframes highlight {
            0% { background-color: rgba(255, 255, 0, 0.3); }
            100% { background-color: transparent; }
        }
        
        .toggle-section {
            margin-left: 10px;
            padding: 0.25rem 0.5rem;
        }
        
        .reading-progress {
            position: fixed;
            top: 56px;
            left: 0;
            height: 4px;
            background-color: #1a3c8a;
            z-index: 1000;
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
});
