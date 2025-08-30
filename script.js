// Aguarda o conteúdo da página ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos do formulário que vamos manipular
    const form = document.getElementById('register-form');
    const email = document.getElementById('email');
    const name = document.getElementById('name');
    const lastname = document.getElementById('lastname');
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const passconfirmation = document.getElementById('passconfirmation');
    const agreement = document.getElementById('agreement');

    // Adiciona um "ouvinte" para o evento de 'submit' do formulário
    form.addEventListener('submit', (event) => {
        // Impede o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault();

        // Executa a função que valida todos os campos e armazena o resultado (true ou false)
        const isFormValid = validateInputs();

        if (isFormValid) {
            // Se o formulário for válido, exibe uma mensagem de sucesso
            // Em um caso real, aqui você enviaria os dados para o servidor (backend)
            alert('Cadastro realizado com sucesso!');
            console.log('Enviando formulário...');
            // form.submit(); // Descomente esta linha para permitir o envio real
        } else {
            console.log('Formulário contém erros. Por favor, corrija.');
        }
    });

    // Função principal que orquestra a validação de todos os inputs
    const validateInputs = () => {
        // Pega os valores dos inputs, removendo espaços em branco do início e do fim
        const emailValue = email.value.trim();
        const nameValue = name.value.trim();
        const lastnameValue = lastname.value.trim();
        const loginValue = login.value.trim();
        const passwordValue = password.value.trim();
        const passconfirmationValue = passconfirmation.value.trim();

        // Usa um "flag" para rastrear a validade geral do formulário
        let isValid = true;

        // --- VALIDAÇÃO DOS CAMPOS ---

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
            setError(name, 'O nome é obrigatório.');
            isValid = false;
        } else {
            setSuccess(name);
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
            // Nota: a estilização de erro para checkbox é diferente
            setError(agreement, 'Você deve aceitar os termos de uso.');
            isValid = false;
        } else {
            setSuccess(agreement);
        }
        
        return isValid;
    };

    /**
     * Função para exibir uma mensagem de erro abaixo do input.
     * @param {HTMLElement} input - O elemento do input que tem o erro.
     * @param {string} message - A mensagem de erro a ser exibida.
     */
    const setError = (input, message) => {
        const inputGroup = input.parentElement; // Pega o 'div.input-group'
        
        // Remove qualquer mensagem de erro que já exista para não duplicar
        const errorDisplay = inputGroup.querySelector('.error-validation');
        if(errorDisplay) {
            errorDisplay.remove();
        }

        // Cria um novo elemento 'div' para a mensagem de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'error-validation';
        errorElement.innerText = message;
        
        // Adiciona a classe de erro ao input e insere a mensagem no DOM
        input.classList.add('error');
        input.classList.remove('success');
        inputGroup.appendChild(errorElement);
    };

    /**
     * Função para limpar o estado de erro e marcar o input como válido.
     * @param {HTMLElement} input - O elemento do input que está correto.
     */
    const setSuccess = (input) => {
        const inputGroup = input.parentElement;
        
        // Remove a mensagem de erro se ela existir
        const errorDisplay = inputGroup.querySelector('.error-validation');
        if (errorDisplay) {
            errorDisplay.remove();
        }

        // Adiciona a classe de sucesso e remove a de erro
        input.classList.add('success');
        input.classList.remove('error');
    };

    /**
     * Função que valida o formato do e-mail usando uma expressão regular (Regex).
     * @param {string} email - O e-mail a ser validado.
     * @returns {boolean} - Retorna true se o e-mail for válido, false caso contrário.
     */
    const isEmailValid = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
});