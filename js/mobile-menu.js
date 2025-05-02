document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-toggle')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}); 