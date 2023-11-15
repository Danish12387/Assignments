import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";

import {
    getFirestore, collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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
const database = getDatabase(app)
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

const addDataToFS = collection(db, 'blogs')

const form1 = document.getElementById('form-1')
const form2 = document.getElementById('form-2')
const signUpPage = document.getElementById('sign-up-page')
const loginPage = document.getElementById('login-page')
const dashboard = document.getElementById('dashboard')
const userName = document.getElementById('userName')
const dotsContainer = document.querySelector('.dots-container')
const postBlogBtn = document.getElementById('post-blog-btn')
const blogInput = document.getElementById('blog-input')
const blogDesc = document.getElementById('textarea')
const blog = document.getElementById('blog')

setTimeout(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;

            signUpPage.style.display = 'none'
            loginPage.style.display = 'none'
            dotsContainer.style.display = 'none'
            dashboard.style.display = 'block'

            userName.innerHTML = user.email
            getDataFS()
        } else {
            signUpPage.style.display = 'block'
        }
    });
}, '1000');

form1.addEventListener('submit', (e) => {
    e.preventDefault()

    let userInfo = {}

    if (e.target[2].value == e.target[3].value) {

        userInfo.name = e.target[0].value
        userInfo.email = e.target[1].value
        userInfo.password = e.target[3].value

        userName.innerHTML = userInfo.name
    }
    else {
        alert("Password must be same.")
    }
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
            const user = userCredential.user;

            set(ref(database, 'users/' + user.uid), {
                username: userInfo.name,
                email: userInfo.email
            })

            alert('Signed Up successfully.')
            // window.location.href = 'https://serene-figolla-e2186d.netlify.app/'
            signUpPage.style.display = 'none'
            loginPage.style.display = 'none'
            dashboard.style.display = 'block'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
        })
})


form2.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInfo = {
        email: e.target[0].value,
        password: e.target[1].value
    }

    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
            const user = userCredential.user;

            const date = new Date()
            const dt = date.toLocaleString()

            update(ref(database, 'users/' + user.uid), {
                last_login: dt
            })

            userName.innerHTML = userInfo.email

            signUpPage.style.display = 'none'
            loginPage.style.display = 'none'
            dashboard.style.display = 'block'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Invalid Email or password.')
        });
})

const logout = document.getElementById('logout')

logout.addEventListener('click', () => {
    signOut(auth).then(() => {

        alert('Do you want to logout.')

        loginPage.style.display = 'block'
        signUpPage.style.display = 'none'
        dashboard.style.display = 'none'

    })
        .catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)

        });
})

postBlogBtn.addEventListener('click', async () => {

    if (!blogInput.value && !blogDesc.value) return alert('Enter your title and description!')

    try {
        const docRef = await addDoc(addDataToFS, {
            Title: blogInput.value,
            Desc: blogDesc.value
        });

        console.log("Document written with ID: ", docRef.id);

    } catch (e) {
        console.error("Error adding document: ", e);
    }

    getDataFS()

    blogDesc.value = ''
    blogInput.value = ''
})

async function getDataFS() {
    blog.innerHTML = null

    const querySnapshot = await getDocs(addDataToFS);
    querySnapshot.forEach((doc) => {    

        const FSData = doc.data()

        const blogDiv = `<div>
        <h1>${FSData.Title}</h1>
        <p>${FSData.Desc}</p>
        <button id=${this.doc.id} class="del-btn">Delete</button>
        </div>`
        
        blog.innerHTML += blogDiv
        
        const buttonElement = document.getElementById(this.doc.id);
        
        if (buttonElement) {
            buttonElement.addEventListener('click', function() {

                console.log(`Button with id ${this.doc.id} clicked!`);
                
            });
        } else {
            console.error(`Button with id ${this.doc.id} not found`);
        }

    });

}

const login = document.getElementById('login')
const signup = document.getElementById('signup')
const link = document.getElementById('link')
const checkBox1 = document.getElementById('checkbox-1')
const checkBox2 = document.getElementById('checkbox-2')
let password1 = document.getElementById('password-1')
let password2 = document.getElementById('password-2')
let password3 = document.getElementById('password-3')

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
    password1.type = checkBox1.checked ? 'text' : 'password'
    password2.type = checkBox1.checked ? 'text' : 'password'
})
checkBox2.addEventListener('change', () => {
    password3.type = checkBox2.checked ? 'text' : 'password'
})

