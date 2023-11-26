import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";

import {
    getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc, query, where
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
const postBlogForm = document.getElementById('postBlogForm')

let useruid;
let userNameVar;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        useruid = user.uid;

        const docRef = doc(db, "userName", user.uid);
        const docSnap = await getDoc(docRef);

        userName.innerHTML = docSnap.data().username
        userNameVar = docSnap.data().username

        setTimeout(() => {
            signUpPage.style.display = 'none'
            loginPage.style.display = 'none'
            dashboard.style.display = 'block'
            dotsContainer.style.display = 'none'
        }, '1000');

        getDataFS()
    } else {
        signUpPage.style.display = 'block'
        dotsContainer.style.display = 'none'
    }

});

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
        .then(async (userCredential) => {
            const user = userCredential.user;

            set(ref(database, 'users/' + user.uid), {
                username: userInfo.name,
                email: userInfo.email
            })

            const userRef = doc(db, "userName", user.uid)
            await setDoc(userRef, {
                username: userInfo.name,
                email: userInfo.email
            })

            alert('Signed Up successfully.')
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
    if (confirm('Do you want to logout.')) {
        signOut(auth).then(() => {

            dotsContainer.style.display = 'flex'
            dashboard.style.display = 'none'
            loginPage.style.display = 'none'
            signUpPage.style.display = 'none'

            setTimeout(() => {
                loginPage.style.display = 'block'
                dotsContainer.style.display = 'none'
            }, '2000');

        })
            .catch((error) => {

                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)

            });
    }
})

async function PostBlog() {

    if (!blogInput.value || !blogDesc.value) return alert('Enter your title and description!');

    let userLevel;
    document.getElementsByName('level').forEach((data) => {
        if (data.checked) {
            userLevel = data.value
        }
    })

    const date = new Date()
    const newDate = date.toLocaleString()

    try {
        const docRef = await addDoc(addDataToFS, {
            Title: blogInput.value,
            Desc: blogDesc.value,
            user: useruid,
            level: userLevel,
            username: userNameVar,
            date: newDate
        });

        console.log("Document written with ID: ", docRef.id);

    } catch (e) {
        console.error("Error adding document: ", e);
    }

    getDataFS()

    blogDesc.value = ''
    blogInput.value = ''
}

postBlogBtn.addEventListener('click', () => {
    PostBlog()
})

postBlogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    PostBlog();
})

async function getDataFS() {
    blog.innerHTML = null

    const querySnapshot = await getDocs(addDataToFS);
    querySnapshot.forEach(async (FSDoc) => {
        const FSData = FSDoc.data()

        const blogDiv = document.createElement('div')
        blogDiv.className = 'blog-div'
        const userNameDiv = document.createElement('div')
        const userNameSpan = document.createElement('span')
        const newDate = document.createElement('span')
        newDate.innerHTML = FSData.date
        const main = document.createElement('div')
        main.className = 'blog-main'
        const title = document.createElement('h3')
        title.className = 'blog-title'
        title.innerHTML = FSData.Title
        const span = document.createElement('span')
        span.className = 'blog-desc'
        span.innerHTML = FSData.Desc
        const button = document.createElement('a')
        button.className = 'del-btn'
        button.innerHTML = 'Delete'
        button.id = FSDoc.id

        blogDiv.appendChild(userNameDiv)
        userNameDiv.appendChild(userNameSpan)
        userNameDiv.appendChild(newDate)
        blogDiv.appendChild(main)
        main.appendChild(title)
        main.appendChild(span)
        blogDiv.appendChild(button)
        blog.appendChild(blogDiv)

        userNameSpan.innerHTML = FSData.username

        button.addEventListener('click', async function () {

            if (confirm('Do you want to delete!')) {
                const docRef = doc(db, 'blogs', this.id)
                await deleteDoc(docRef)
                getDataFS()
            }
        });

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
const navDiv1 = document.querySelector('.nav-div-1')
const navDiv2 = document.querySelector('.nav-div-2')
const navRight = document.querySelector('.nav-right')
const filterBtn = document.getElementById('filterBtn')

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

navDiv1.addEventListener('mouseover', () => {
    navDiv2.style.display = 'block'
    navRight.style.height = '178px'
})

navDiv2.addEventListener('mouseover', () => {
    navDiv2.style.display = 'block'
    navRight.style.height = '178px'
})

navDiv1.addEventListener('mouseout', () => {
    navDiv2.style.display = 'none'
    navRight.style.height = '70px'
})
navDiv2.addEventListener('mouseout', () => {
    navDiv2.style.display = 'none'
    navRight.style.height = '70px'
})

filterBtn.addEventListener('click', () => {
    let filter;
    let q;
    document.getElementsByName('query').forEach((data) => {
        if (data.checked) {
            filter = data.value
        }
    })
    if (filter === "All") {
        q = query(collection(db, "blogs"), where())
    }
    if (filter === "Beginner") {
        q = query(collection(db, "blogs"), where("level", "==", "Beginner"))
    }
    if (filter === "Intermediate") {
        q = query(collection(db, "blogs"), where("level", "==", "Intermediate"))
    }
    if (filter === "Expert") {
        q = query(collection(db, "blogs"), where("level", "==", "Expert"))
    }

    console.log(filter);
})