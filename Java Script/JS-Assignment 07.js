import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAHQyxWbE0KXf5RYphu1syMdxxLciEq-Jk",
    authDomain: "blog-app-ab7a6.firebaseapp.com",
    projectId: "blog-app-ab7a6",
    storageBucket: "blog-app-ab7a6.appspot.com",
    messagingSenderId: "993767007431",
    appId: "1:993767007431:web:ef1a307738ba35d1a40ae2",
    measurementId: "G-1Z0SBNGKMJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

const form1 = document.getElementById('form-1')
const form2 = document.getElementById('form-2')

form1.addEventListener('submit', (e)=>{
    e.preventDefault()
    const userInfo = {
        name: e.target[0].value,
        email: e.target[1].value,
        password: e.target[3].value
    }
    console.log(e);
    console.log(userInfo)
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
            const user = userCredential.userInfo;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        })
})

form2.addEventListener('submit', (e)=>{
    e.preventDefault()
    const userInfo = {
        email: e.target[0].value,
        password: e.target[1].value
    }
    console.log(e);
    console.log(userInfo)
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
            const user = userCredential.userInfo;
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.location.href = "https://serene-figolla-e2186d.netlify.app/"
        })
})

const login = document.getElementById('login')
const signup = document.getElementById('signup')
const signUpPage = document.getElementById('sign-up-page')
const loginPage = document.getElementById('login-page')
const link = document.getElementById('link')
const checkBox1 = document.getElementById('checkbox-1')
const checkBox2 = document.getElementById('checkbox-2')

signup.addEventListener('click', () => {
    loginPage.style.display = 'none'
    signUpPage.style.display = 'block'
})

login.addEventListener('click', () => {
    loginPage.style.display = 'block'
    signUpPage.style.display = 'none'
})

link.addEventListener('click', () => {
    loginPage.style.display = 'block'
    signUpPage.style.display = 'none'
})

checkBox1.addEventListener('change', () => {
    let password1 = document.getElementById('password-1')
    let password2 = document.getElementById('password-2')
    let password3 = document.getElementById('password-3')
    password1.type = this.checked ? 'text' : 'password'
    password2.type = this.checked ? 'text' : 'password'
    password3.type = this.checked ? 'text' : 'password'
})
checkBox2.addEventListener('change', () => {
    let password1 = document.getElementById('password-1')
    let password2 = document.getElementById('password-2')
    let password3 = document.getElementById('password-3')
    password1.type = this.checked ? 'text' : 'password'
    password2.type = this.checked ? 'text' : 'password' 
    password3.type = this.checked ? 'text' : 'password'
})

