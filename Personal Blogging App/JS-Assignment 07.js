import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, set, update } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";

import {
    getFirestore, collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc, query, where, updateDoc, serverTimestamp, onSnapshot, orderBy
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

import {
    getStorage, uploadBytes, ref, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

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
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

const addDataToFS = collection(db, 'blogs')

const form1 = document.getElementById('form-1')
const form2 = document.getElementById('form-2')
const signUpPage = document.getElementById('sign-up-page')
const loginPage = document.getElementById('login-page')
const dashboard = document.getElementById('dashboard')
const userName = document.getElementById('userName')
// const dotsContainer = document.querySelector('.dots-container')
const postBlogBtn = document.getElementById('post-blog-btn')
const blogInput = document.getElementById('blog-input')
const blogDesc = document.getElementById('textarea')
const blog = document.getElementById('blog')
const postBlogForm = document.getElementById('postBlogForm')
const profileUserName = document.getElementById('profileUserName')
const CurrentPassword = document.getElementById('CurrentPassword')
const NewPassword = document.getElementById('NewPassword')
const RepeatPassword = document.getElementById('RepeatPassword')
const userProfileBtn = document.getElementById('userProfileBtn')
const userProfilePhoto = document.getElementById('userProfilePhoto')
const UserProfileImg = document.getElementById('UserProfileImg')
const profileimglogo = document.getElementById('profileimglogo')
const chatContainer = document.getElementById('chatContainer')
const chatUsers = document.getElementById('chat_users')
const chatMsgs = document.getElementById('chat_msgs')
const chatInput = document.getElementById('chat_input')
const chatBtn = document.getElementById('chat_btn')

let useruid;
let userNameVar;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        useruid = user.uid;

        const docRef = doc(db, "userName", user.uid);
        const docSnap = await getDoc(docRef);

        if (profileUserName) {
            profileUserName.value = docSnap.data().username
        }

        if (docSnap.data() && userName) {
            userName.innerHTML = docSnap.data().username;
        }

        userNameVar = docSnap.data().username

        if (docSnap.data().profileImage) {
            if (profileimglogo) {
                profileimglogo.src = docSnap.data().profileImage
            }
            if (UserProfileImg) {
                UserProfileImg.src = docSnap.data().profileImage
            }
        }

        setTimeout(() => {
            if (signUpPage) {
                signUpPage.style.display = 'none'
                loginPage.style.display = 'none'
                dashboard.style.display = 'block'
                // dotsContainer.style.display = 'none'
            }
        }, '1000');
        if (chatContainer) {

        }
        getAllUsers()
        getDataFS()
    } else {
        signUpPage.style.display = 'block'
        // dotsContainer.style.display = 'none'
    }

});

form1?.addEventListener('submit', (e) => {
    e.preventDefault()

    let userInfo = {}

    if (e.target[2].value == e.target[3].value) {

        userInfo.name = e.target[0].value
        userInfo.email = e.target[1].value
        userInfo.password = e.target[3].value

        // userName.innerHTML = userInfo.name
    }
    else {
        alert("Password must be same.")
    }
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // set(ref(database, 'users/' + user.uid), {
            //     username: userInfo.name,
            //     email: userInfo.email
            // })

            const userRef = doc(db, "userName", user.uid)
            await setDoc(userRef, {
                username: userInfo.name,
                email: userInfo.email,
                password: userInfo.password
            })

            profileimglogo.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

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


form2?.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInfo = {
        email: e.target[0].value,
        password: e.target[1].value
    }

    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
            const user = userCredential.user;

            // const date = new Date()
            // const dt = date.toLocaleString()

            // update(ref(database, 'users/' + user.uid), {
            //     last_login: dt
            // })
            profileimglogo.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

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

logout?.addEventListener('click', () => {
    if (confirm('Do you want to logout.')) {
        signOut(auth).then(() => {

            if (!blog) {
                window.location.href = 'JS-Assignment 07.html'
                dashboard.style.display = 'none'
                loginPage.style.display = 'none'
                signUpPage.style.display = 'block'
            }

            // dotsContainer.style.display = 'flex'
            dashboard.style.display = 'none'
            loginPage.style.display = 'none'
            signUpPage.style.display = 'none'

            setTimeout(() => {
                loginPage.style.display = 'block'
                // dotsContainer.style.display = 'none'
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

postBlogBtn?.addEventListener('click', () => {
    PostBlog()
})

postBlogForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    PostBlog();
})

async function getDataFS(q = query(collection(db, "blogs"))) {
    if (blog) {
        blog.innerHTML = null
    }

    const querySnapshot = await getDocs(q);
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
        blog?.appendChild(blogDiv)

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

userProfileBtn?.addEventListener('click', async () => {

    const docRef = doc(db, "userName", useruid);
    const docSnap = await getDoc(docRef);
    const UserinfoRef = docSnap.data()

    const newPassword = NewPassword.value.trim()
    const repeatPassword = RepeatPassword.value.trim()
    const currentPassword = CurrentPassword.value.trim()

    if (!profileUserName.value) return alert('Enter a Username!')

    if (currentPassword && repeatPassword && newPassword) {

        if (UserinfoRef.password !== currentPassword) return alert('Sahi password dalien.')

        if (newPassword !== repeatPassword) return alert('Passwords must be same!')

        try {
            let userInfo = {
                username: profileUserName.value,
                password: newPassword
            }
            await updateDoc(doc(db, "userName", useruid), userInfo)
            NewPassword.value = ''
            RepeatPassword.value = ''
            CurrentPassword.value = ''

            alert('User Profile Updated.')
        } catch (err) {
            console.log(err);
        }

    }
})

userProfilePhoto?.addEventListener('change', async function () {

    const profilePhotoRef = ref(storage, `users/${useruid}`)
    try {
        await uploadBytes(profilePhotoRef, this.files[0]).then(async (snapshot) => {

            getDownloadURL(profilePhotoRef)
                .then(async (url) => {
                    await updateDoc(doc(db, "userName", useruid), {
                        profileImage: url
                    })
                })
                .catch((err) => console.log(err))

            const docRef = doc(db, "userName", useruid);
            const docSnap = await getDoc(docRef);

            if (docSnap.data().profileImage) {
                UserProfileImg.src = ''
                UserProfileImg.src = docSnap.data().profileImage
            }
        })
        alert('Profile Photo Updated.');
    } catch (err) {
        console.log(err);
    }
})

let anotherUser;

async function getAllUsers() {
    const userCollREf = collection(db, 'userName')
    const querySnapshot = await getDocs(userCollREf);
    if (chatUsers) {
        chatUsers.innerHTML = null
    }

    if (querySnapshot.empty) return chatUsers.innerHTML = 'No Users.'

    querySnapshot.forEach(async (FSDoc) => {
        let userInfo = FSDoc.data()

        const div = document.createElement('div')
        div.id = FSDoc.id
        div.className = 'chat_users_div'
        const span = document.createElement('span')
        span.innerText = userInfo.username
        const img = document.createElement('img')
        img.src = userInfo.profileImage ? userInfo.profileImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

        if (chatUsers) {
            div.appendChild(img)
            div.appendChild(span)
            chatUsers.appendChild(div)
        }

        div.addEventListener('click', function () {

            const allUsersDiv = document.getElementsByClassName('chat_users_div')
            for (let i = 0; i < allUsersDiv.length; i++) {
                allUsersDiv[i].style.backgroundColor = 'white'
            }
            this.style.backgroundColor = 'rgb(221, 221, 221)'
            anotherUser = this.id
            getChatMsgs()
            setTimeout(()=>{
                chatMsgs.scrollTop = chatMsgs.scrollHeight;
            }, '400')
        })
    })

}

chatBtn?.addEventListener('click', async () => {
    if (!chatInput.value) return

    try {
        const chatRef = collection(db, 'chat')
        const obj = {
            msg: chatInput.value,
            from: useruid,
            timestamp: serverTimestamp(),
            participants: [useruid, anotherUser],
            chatID: generateChatId()
        }
        await addDoc(chatRef, obj)
        chatInput.value = ''
    } catch (err) {
        console.log(err);
    }
    setTimeout(()=>{
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }, '400')
})

function generateChatId() {
    let chatId = useruid > anotherUser ? useruid + anotherUser : anotherUser + useruid
    return chatId
}

async function getChatMsgs() {
    chatMsgs.innerHTML = null
    const chatQuery = query(collection(db, 'chat'),
        orderBy('timestamp'),
        where('chatID', '==', generateChatId()))

    onSnapshot(chatQuery, (doc) => {
        if (!doc.empty) {
            chatMsgs.innerHTML = null

            doc.forEach((data) => {
                const chat = data.data()

                const chatMainDiv = document.createElement('div')
                chatMainDiv.className = `chat_main_div ${chat.from == useruid ? 'current_user_msg' : 'another_user_msg'}`
                const chatDiv = document.createElement('div')
                chatDiv.innerHTML = chat.msg
                chatDiv.className = 'msg_div'
                const timespan = document.createElement('span')
                timespan.className = 'time_spam'
                timespan.innerHTML = dayjs(chat.timestamp.toDate()).format('ddd DD MMM YYYY ' + ' hh:mma')

                chatDiv.appendChild(timespan)
                chatMainDiv.appendChild(chatDiv)
                chatMsgs.appendChild(chatMainDiv)

            })
        }
        
        setTimeout(()=>{
            chatMsgs.scrollTop = chatMsgs.scrollHeight;
        }, '400')
    })
}

const login = document.getElementById('login')
const signup = document.getElementById('signup')
const link = document.getElementById('link')
const checkBox1 = document.getElementById('checkbox-1')
const checkBox2 = document.getElementById('checkbox-2')
const password1 = document.getElementById('password-1')
const password2 = document.getElementById('password-2')
const password3 = document.getElementById('password-3')
const navDiv1 = document.querySelector('.nav-div-1')
const navDiv2 = document.querySelector('.nav-div-2')
const filterBtn = document.getElementById('filterBtn')
const myBlog = document.getElementById('myBlog')
const profile = document.getElementById('profile')

signup?.addEventListener('click', () => {
    loginPage.style.display = 'none'
    signUpPage.style.display = 'block'
})

login?.addEventListener('click', () => {
    loginPage.style.display = 'block'
    signUpPage.style.display = 'none'
})

link?.addEventListener('click', () => {
    loginPage.style.display = 'block'
    signUpPage.style.display = 'none'
})

checkBox1?.addEventListener('change', () => {
    password1.type = checkBox1.checked ? 'text' : 'password'
    password2.type = checkBox1.checked ? 'text' : 'password'
})
checkBox2?.addEventListener('change', () => {
    password3.type = checkBox2.checked ? 'text' : 'password'
})

navDiv1?.addEventListener('mouseover', () => {
    navDiv2.style.top = '100%'
})

navDiv2?.addEventListener('mouseover', () => {
    navDiv2.style.top = '100%'
})

navDiv1?.addEventListener('mouseout', () => {
    navDiv2.style.top = '-150%'
})
navDiv2?.addEventListener('mouseout', () => {
    navDiv2.style.top = '-150%'
})

filterBtn?.addEventListener('click', () => {
    let filter;
    let q;
    document.getElementsByName('query').forEach((data) => {
        if (data.checked) {
            filter = data.value
        }
    })
    if (filter === "All") {
        q = query(collection(db, "blogs"))
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
    getDataFS(q)

    console.log(filter);
})

myBlog?.addEventListener('click', () => {
    if (!blog) {
        window.location.href = 'JS-Assignment 07.html'
    }
    let myBlogsQ = query(collection(db, "blogs"), where("user", "==", useruid))
    getDataFS(myBlogsQ)
})

profile?.addEventListener('click', () => {
    window.location.href = 'JS-Assignment 07 Profile.html'
})
