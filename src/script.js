
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();      
const auth = firebase.auth();         


document.addEventListener('DOMContentLoaded', () => {

    
    const form = document.getElementById('register-form');
    const email = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const lastname = document.getElementById('lastname');
    const telefone = document.getElementById('telefone');
    const endereco = document.getElementById('endereco');
    const login = document.getElementById('login');
    const password = document.getElementById('password');
    const passconfirmation = document.getElementById('passconfirmation');
    const agreement = document.getElementById('agreement');
    const submitButton = document.getElementById('btn-submit');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const isFormValid = validateInputs();

        if (isFormValid) {
            submitButton.disabled = true;
            submitButton.innerText = 'Enviando...';

            try {
                

                
                const userCredential = await auth.createUserWithEmailAndPassword(email.value.trim(), password.value.trim());
                const user = userCredential.user;

                console.log("Usuário criado com sucesso no Auth! UID:", user.uid);

                
                
                const userProfileData = {
                    email: email.value.trim(),
                    nome: nameInput.value.trim(),
                    sobrenome: lastname.value.trim(),
                    telefone: telefone.value.trim(),
                    endereco: endereco.value.trim(),
                    login: login.value.trim(),
                    timestamp: new Date() 
                };

                
                
                await db.collection("usuarios").doc(user.uid).set(userProfileData);
                
                console.log("Dados do perfil salvos no Firestore com o ID:", user.uid);

                
                
                await user.sendEmailVerification();
                console.log("E-mail de verificação enviado.");

                
                alert('Usuário registrado com sucesso! Um link de verificação foi enviado para o seu e-mail. Por favor, verifique sua caixa de entrada.');
                
                
                form.reset(); 

            } catch (error) {
                
                console.error("Erro ao registrar usuário: ", error.code, error.message);

                
                if (error.code === 'auth/email-already-in-use') {
                    alert('Este endereço de e-mail já está cadastrado.');
                    setError(email, 'Este e-mail já está em uso.');
                } else if (error.code === 'auth/weak-password') {
                    alert('A senha é muito fraca. Use pelo menos 6 caracteres.');
                    setError(password, 'A senha deve ter no mínimo 6 caracteres.');
                } else if (error.code === 'auth/invalid-email') {
                    alert('O formato do e-mail é inválido.');
                    setError(email, 'Por favor, insira um e-mail válido.');
                } else {
                    alert('Ocorreu um erro inesperado ao realizar o cadastro.');
                }

            } finally {
                
                submitButton.disabled = false;
                submitButton.innerText = 'Registrar';
            }
        } else {
            console.log('Formulário contém erros. Por favor, corrija.');
        }
    });

    
    

    const validateInputs = () => {
        const emailValue = email.value.trim();
        const nameValue = nameInput.value.trim();
        const lastnameValue = lastname.value.trim();
        const loginValue = login.value.trim();
        const passwordValue = password.value.trim();
        const passconfirmationValue = passconfirmation.value.trim();
        let isValid = true;
        if(emailValue===''){setError(email,'O e-mail é obrigatório.');isValid=false;}else if(!isEmailValid(emailValue)){setError(email,'Por favor, insira um e-mail válido.');isValid=false;}else{setSuccess(email);}
        if(nameValue===''){setError(nameInput,'O nome é obrigatório.');isValid=false;}else{setSuccess(nameInput);}
        if(lastnameValue===''){setError(lastname,'O sobrenome é obrigatório.');isValid=false;}else{setSuccess(lastname);}
        if(loginValue===''){setError(login,'O nome de usuário é obrigatório.');isValid=false;}else{setSuccess(login);}
        if(passwordValue===''){setError(password,'A senha é obrigatória.');isValid=false;}else if(passwordValue.length<8){setError(password,'A senha deve ter no mínimo 8 caracteres.');isValid=false;}else{setSuccess(password);}
        if(passconfirmationValue===''){setError(passconfirmation,'A confirmação da senha é obrigatória.');isValid=false;}else if(passwordValue!==passconfirmationValue){setError(passconfirmation,'As senhas não coincidem.');isValid=false;}else{setSuccess(passconfirmation);}
        if(!agreement.checked){setError(agreement,'Você deve aceitar os termos de uso.');isValid=false;}else{setSuccess(agreement);}
        return isValid;
    };
    const setError = (input, message) => {
        const inputGroup = input.parentElement;
        let errorDisplay = inputGroup.querySelector('.error-validation');
        if(!errorDisplay){errorDisplay=document.createElement('div');errorDisplay.className='error-validation';inputGroup.appendChild(errorDisplay);}
        errorDisplay.innerText=message;input.classList.add('error');input.classList.remove('success');
    };
    const setSuccess = (input) => {
        const inputGroup = input.parentElement;
        const errorDisplay = inputGroup.querySelector('.error-validation');
        if(errorDisplay){errorDisplay.remove();}
        input.classList.add('success');input.classList.remove('error');
    };
    const isEmailValid = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
});