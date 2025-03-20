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
        }
    });
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
    backToTopButton.innerHTML = '&uarr;';
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
