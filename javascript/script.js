// Navigation menu toggle
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu after clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll to anchor
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-title, .about-content, .project-card, .contact-item, .contact-form');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initialize element styles
const initAnimation = () => {
    const elements = document.querySelectorAll('.section-title, .about-content, .project-card, .contact-item, .contact-form');
    
    elements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
};

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 这里只是一个示例，实际应用中需要替换为真实的表单提交逻辑
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // 简单验证
        if (nameInput.value && emailInput.value && messageInput.value) {
            alert('表单提交成功！我们会尽快联系您。');
            contactForm.reset();
        } else {
            alert('请填写所有必填字段。');
        }
    });
}

// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('theme-toggle');
    if (initialTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Add event listener for theme toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Get GitHub User Info with caching
async function getGitHubUserInfo(username) {
    // Check for cached data
    const cachedData = localStorage.getItem(`github_user_${username}`);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub user data');
        }
        const data = await response.json();
        // Cache for 1 hour
        localStorage.setItem(`github_user_${username}`, JSON.stringify(data));
        setTimeout(() => {
            localStorage.removeItem(`github_user_${username}`);
        }, 3600000);
        return data;
    } catch (error) {
        console.error('Error fetching GitHub user info:', error);
        return null;
    }
}

// Get GitHub Repositories with caching
async function getGitHubRepos(username, userAvatar = null) {
    // Check for cached data
    const cachedData = localStorage.getItem(`github_repos_${username}`);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }
        const repos = await response.json();
        
        // Add image URLs for each repo
        const reposWithImages = repos.map(repo => ({
            ...repo,
            // Use user avatar if provided, otherwise use picsum.photos
            imageUrl: userAvatar ? userAvatar : `https://picsum.photos/seed/${repo.id}/400/300`
        }));

        // Cache for 1 hour
        localStorage.setItem(`github_repos_${username}`, JSON.stringify(reposWithImages));
        setTimeout(() => {
            localStorage.removeItem(`github_repos_${username}`);
        }, 3600000);

        return reposWithImages;
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        // Provide fallback data if API fails
        return [
            {
                id: 1,
                name: 'Project 1',
                description: 'This is a sample project.',
                language: 'JavaScript',
                html_url: '#',
                imageUrl: userAvatar ? userAvatar : 'https://picsum.photos/seed/project1/400/300'
            },
            {
                id: 2,
                name: 'Project 2',
                description: 'Another sample project with demo.',
                language: 'Python',
                html_url: '#',
                imageUrl: userAvatar ? userAvatar : 'https://picsum.photos/seed/project2/400/300'
            },
            {
                id: 3,
                name: 'Project 3',
                description: 'A sample web application.',
                language: 'HTML',
                html_url: '#',
                imageUrl: userAvatar ? userAvatar : 'https://picsum.photos/seed/project3/400/300'
            }
        ];
    }
}

// Display GitHub User Info
function displayGitHubUserInfo(userData) {
    if (!userData) return;
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (heroTitle) {
        heroTitle.textContent = userData.name || userData.login;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = userData.bio || '[Your Profession/Title]';
    }
    
    // Update about section
    const aboutText = document.querySelector('.about-text p:first-child');
    if (aboutText) {
        aboutText.textContent = `Welcome to my portfolio! I'm ${userData.name || userData.login}, ${userData.bio || 'a passionate developer'}.`;
    }
    
    // Update GitHub link
    const githubLinks = document.querySelectorAll('.social-link[href*="github.com"]');
    githubLinks.forEach(link => {
        link.href = userData.html_url;
    });
    
    // Update profile image
    const placeholderImages = document.querySelectorAll('.placeholder-image');
    placeholderImages.forEach(image => {
        image.style.backgroundImage = `url('${userData.avatar_url}')`;
        image.style.backgroundSize = 'cover';
        image.style.backgroundPosition = 'center';
    });
}

// Display GitHub Repositories with lazy loading for images
function displayGitHubRepos(repos) {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;
    
    // Clear existing project cards
    projectGrid.innerHTML = '';
    
    // Create new project cards for each repo
    repos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Add repo description or default text
        const description = repo.description || 'A GitHub repository';
        
        // Add tech badges (simplified - just shows main language)
        const techBadge = repo.language ? 
            `<span class="tech-badge">${repo.language}</span>` : 
            '<span class="tech-badge">Unknown</span>';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E" data-src="${repo.imageUrl}" alt="${repo.name}" class="project-img lazyload">
            </div>
            <div class="project-content">
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-description">${description}</p>
                <div class="project-tech">
                    ${techBadge}
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" class="project-link"><i class="fab fa-github"></i> GitHub</a>
                </div>
            </div>
        `;
        
        projectGrid.appendChild(projectCard);
    });

    // Initialize lazy loading for project images
    const lazyLoadImages = () => {
        const lazyImages = document.querySelectorAll('.lazyload');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.classList.remove('lazyload');
                        imageObserver.unobserve(image);
                    }
                });
            });

            lazyImages.forEach(image => {
                imageObserver.observe(image);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(image => {
                image.src = image.dataset.src;
                image.classList.remove('lazyload');
            });
        }
    };

    lazyLoadImages();
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Initialize critical functionality immediately
    initCriticalFeatures();

    // Lazy load non-critical functionality after a short delay
    setTimeout(initNonCriticalFeatures, 500);
});

// Initialize critical features that need to load immediately
function initCriticalFeatures() {
    initAnimation();
    animateOnScroll();
    initTheme();
    
    // Set current active link
    const currentPath = window.location.hash || '#home';
    document.querySelector(`.nav-link[href="${currentPath}"]`).classList.add('active');
}

// Initialize non-critical features that can be lazy loaded
async function initNonCriticalFeatures() {
    // Get and display GitHub user info
    const githubUserData = await getGitHubUserInfo('curnel');
    displayGitHubUserInfo(githubUserData);

    // Extract user avatar URL
    const userAvatar = githubUserData ? githubUserData.avatar_url : null;

    // Get and display GitHub repositories
    const githubRepos = await getGitHubRepos('curnel', userAvatar);
    displayGitHubRepos(githubRepos);
}

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Mobile menu button animation
menuToggle.addEventListener('click', () => {
    const bars = document.querySelectorAll('.bar');
    bars[0].classList.toggle('active');
    bars[1].classList.toggle('active');
    bars[2].classList.toggle('active');
});

// Add CSS styles to head for mobile menu button animation
const style = document.createElement('style');
style.textContent = `
    .menu-toggle.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .menu-toggle.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;

document.head.appendChild(style);