// Função para validar e enviar o formulário
function checkValidations() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let valid = true;

    // Validação do nome
    if (name === '') {
        document.querySelector('.name-error').textContent = 'Por favor, insira seu nome.';
        valid = false;
    } else {
        document.querySelector('.name-error').textContent = '';
    }

    // Validação do email
    if (email === '') {
        document.querySelector('.email-error').textContent = 'Por favor, insira seu email.';
        valid = false;
    } else {
        document.querySelector('.email-error').textContent = '';
    }

    // Validação da mensagem
    if (message.length < 1) {
        document.querySelector('.message-error').textContent = 'A mensagem está vazia';
        valid = false;
    } else {
        document.querySelector('.message-error').textContent = '';
    }

    if (valid) {
        sendEmail(name, email, message);
    }

    return valid;
}

// Função para enviar os dados do formulário por e-mail usando EmailJS
function sendEmail(name, email, message) {
    const formData = {
        from_name: name,
        from_email: email,
        message: message,
    };

    emailjs.send('service_j8lf9xk', 'template_4y4vq88', formData)
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert('Mensagem enviada com sucesso!');
        reset();
    }, function(error) {
        console.log('FAILED...', error);
        alert('O envio falhou, tente novamente.');
    });
}

// Função de reset do formulário
function reset() {
    document.getElementById('submit-form').reset();
    document.querySelectorAll('small').forEach(small => small.textContent = '');
}
