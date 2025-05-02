document.addEventListener('DOMContentLoaded', function() {
    loadContactData();
});

function loadContactData() {
    fetch('contact-data.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const contacts = xmlDoc.getElementsByTagName("contact");
            
            const contactInfo = document.querySelector('.contact-info');
            contactInfo.innerHTML = '<h3>Свяжитесь с нами</h3>';
            
            for (let contact of contacts) {
                const type = contact.getElementsByTagName("type")[0].textContent;
                const icon = contact.getElementsByTagName("icon")[0].textContent;
                const value = contact.getElementsByTagName("value")[0].textContent;
                
                const infoItem = document.createElement('div');
                infoItem.className = 'info-item';
                infoItem.innerHTML = `
                    <i class="${icon}"></i>
                    <p>${value}</p>
                `;
                contactInfo.appendChild(infoItem);
            }
        })
        .catch(error => {
            console.error('Error loading contact data:', error);
        });
} 