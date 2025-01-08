// Função para abrir o WhatsApp
document.querySelector('.whatsapp-icon').addEventListener('click', function() {
    window.open('https://api.whatsapp.com/send?phone=5541992292928&text=Ol%C3%A1%2C%20visitei%20o%20site%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.%20Pode%20me%20ajudar%3F', '_blank');
});

// Função para voltar ao topo da página com rolagem suave
document.querySelector('.back-to-top').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Função para rolar a tela até a seção de produtos
document.querySelector('.theme-btn').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('#upcoming-events').scrollIntoView({ behavior: 'smooth' });
});

// Função para rolar suavemente até a seção de Informações de Contato
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});
