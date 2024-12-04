document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const sendEmailBtn = document.getElementById('send-email-btn');
    const emailForm = document.getElementById('email-form');
    const loginForm = document.getElementById('login-form');
    const emailError = document.getElementById('login-error');
    const emailSuccess = document.getElementById('email-success');
    const emailFailure = document.getElementById('email-error');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const toInput = document.getElementById('to');
    const subjectInput = document.getElementById('subject');
    const textInput = document.getElementById('text');
    const attachmentInput = document.getElementById('attachment');

    let token = null;

    // Função para fazer login
    async function login(email, password) {
        try {

            console.log(typeof email)

            const seraObjeto = {"email":email, "senha":  password }
            console.log("🚀 ~ login ~ seraObjeto:", (typeof seraObjeto))
            console.log("🚀 ~ login ~ seraObjeto:",  seraObjeto)
            // formJson = 
            // // const sera = JSON.({ email, senha: password })
            // console.log("🚀 ~ login ~ sera:", sera)
            const response = await fetch('http://44.203.131.120:3001/api/login', {
                method: 'POST',
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: seraObjeto //JSON.stringify({ email, senha: password })
            });

            const data = await response.json();

            if (response.ok) {
                token = data.token;
                loginForm.classList.add('hidden');
                emailForm.classList.remove('hidden');
            } else {
                emailError.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            emailError.classList.remove('hidden');
        }
    }

    // Função para enviar e-mail
    async function sendEmail() {
        if (!token) {
            console.error("Token não encontrado.");
            return;
        }

        const formData = new FormData();
        formData.append('to', toInput.value);
        formData.append('subject', subjectInput.value);
        formData.append('text', textInput.value);
        formData.append('attachment', attachmentInput.files[0]);

        try {
            const response = await fetch('http://44.203.131.120:3001/api/send-email', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                emailSuccess.classList.remove('hidden');
                emailFailure.classList.add('hidden');
            } else {
                emailFailure.classList.remove('hidden');
                emailSuccess.classList.add('hidden');
            }
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            emailFailure.classList.remove('hidden');
            emailSuccess.classList.add('hidden');
        }
    }

    // Adicionando eventos
    loginBtn.addEventListener('click', function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            login(email, password);
        } else {
            emailError.classList.remove('hidden');
        }
    });

    sendEmailBtn.addEventListener('click', function () {
        sendEmail();
    });
});
