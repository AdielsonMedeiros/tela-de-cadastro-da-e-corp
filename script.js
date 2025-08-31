// Cole o objeto de configuração que você copiou do Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyDPX3dljNffKYGU5fI8TRS-Qqc2ybfhDjI",
  authDomain: "allsafe-71650.firebaseapp.com",
  projectId: "allsafe-71650",
  storageBucket: "allsafe-71650.firebasestorage.app",
  messagingSenderId: "1079384435670",
  appId: "1:1079384435670:web:fe4f33f593bc9571b05277"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Obtenha uma instância do Firestore

document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do formulário (o código original continua aqui)
    const form = document.getElementById('register-form');
    const email = document.getElementById('email');
    const nameInput = document.getElementById('name'); // Renomeado para evitar conflito de nome
    const lastname = document.getElementById('lastname');
    const telefone = document.getElementById('telefone');
    const endereco = document.getElementById('endereco');
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const passconfirmation = document.getElementById('passconfirmation');
    const agreement = document.getElementById('agreement');
    const submitButton = document.getElementById('btn-submit');

    form.addEventListener('submit', async (event) => { // Transformamos a função em async
        event.preventDefault();

        const isFormValid = validateInputs();

        if (isFormValid) {
            // Desabilita o botão para evitar múltiplos envios
            submitButton.disabled = true;
            submitButton.innerText = 'Enviando...';

            try {
                // Cria um objeto com os dados do formulário
                const formData = {
                    email: email.value.trim(),
                    nome: nameInput.value.trim(),
                    sobrenome: lastname.value.trim(),
                    telefone: telefone.value.trim(),
                    endereco: endereco.value.trim(),
                    login: login.value.trim(),
                    // NUNCA salve senhas em texto puro em um banco de dados real.
                    // O Firebase Authentication é a ferramenta correta para isso.
                    // Mas para este exemplo, vamos omitir a senha.
                    timestamp: new Date() // Adiciona data e hora do cadastro
                };

                // Adiciona um novo documento a uma coleção chamada "usuarios"
                const docRef = await db.collection("usuarios").add(formData);
                console.log("Documento escrito com ID: ", docRef.id);
                alert('Cadastro realizado com sucesso!');
                form.reset(); // Limpa o formulário

            } catch (error) {
                console.error("Erro ao adicionar documento: ", error);
                alert('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
            } finally {
                // Reabilita o botão após o processo
                submitButton.disabled = false;
                submitButton.innerText = 'Registrar';
            }
        } else {
            console.log('Formulário contém erros. Por favor, corrija.');
        }
    });

    // Função principal que orquestra a validação de todos os inputs
    const validateInputs = () => {
        const emailValue = email.value.trim();
        const nameValue = nameInput.value.trim();
        const lastnameValue = lastname.value.trim();
        const loginValue = login.value.trim();
        const passwordValue = password.value.trim();
        const passconfirmationValue = passconfirmation.value.trim();

        let isValid = true;

        // --- VALIDAÇÃO DOS CAMPOS (O código de validação original permanece o mesmo) ---
        // Validação do E-mail
        if (emailValue === '') {
            setError(email, 'O e-mail é obrigatório.');
            isValid = false;
        } else if (!isEmailValid(emailValue)) {
            setError(email, 'Por favor, insira um e-mail válido.');
            isValid = false;
        } else {
            setSuccess(email);
        }

        // Validação do Nome
        if (nameValue === '') {
            setError(nameInput, 'O nome é obrigatório.');
            isValid = false;
        } else {
            setSuccess(nameInput);
        }

        // Validação do Sobrenome
        if (lastnameValue === '') {
            setError(lastname, 'O sobrenome é obrigatório.');
            isValid = false;
        } else {
            setSuccess(lastname);
        }
        
        // Validação do Login
        if (loginValue === '') {
            setError(login, 'O nome de usuário é obrigatório.');
            isValid = false;
        } else {
            setSuccess(login);
        }

        // Validação da Senha
        if (passwordValue === '') {
            setError(password, 'A senha é obrigatória.');
            isValid = false;
        } else if (passwordValue.length < 8) {
            setError(password, 'A senha deve ter no mínimo 8 caracteres.');
            isValid = false;
        } else {
            setSuccess(password);
        }

        // Validação da Confirmação de Senha
        if (passconfirmationValue === '') {
            setError(passconfirmation, 'A confirmação da senha é obrigatória.');
            isValid = false;
        } else if (passwordValue !== passconfirmationValue) {
            setError(passconfirmation, 'As senhas não coincidem.');
            isValid = false;
        } else {
            setSuccess(passconfirmation);
        }
        
        // Validação do Checkbox de Termos
        if (!agreement.checked) {
            setError(agreement, 'Você deve aceitar os termos de uso.');
            isValid = false;
        } else {
            setSuccess(agreement);
        }
        
        return isValid;
    };

    // --- FUNÇÕES HELPER (setError, setSuccess, isEmailValid permanecem as mesmas) ---
    const setError = (input, message) => {
        const inputGroup = input.parentElement;
        const errorDisplay = inputGroup.querySelector('.error-validation');
        if(errorDisplay) {
            errorDisplay.remove();
        }
        const errorElement = document.createElement('div');
        errorElement.className = 'error-validation';
        errorElement.innerText = message;
        input.classList.add('error');
        input.classList.remove('success');
        inputGroup.appendChild(errorElement);
    };

    const setSuccess = (input) => {
        const inputGroup = input.parentElement;
        const errorDisplay = inputGroup.querySelector('.error-validation');
        if (errorDisplay) {
            errorDisplay.remove();
        }
        input.classList.add('success');
        input.classList.remove('error');
    };

    const isEmailValid = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
});