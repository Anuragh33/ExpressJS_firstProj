import '@babel/polyfill'
import { login, logout } from './login'

const loginBtn = document.querySelector('.form')
const logoutBtn = document.querySelector('.nav__el--logout')

if (loginBtn)
  loginBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })

if (logoutBtn) logoutBtn.addEventListener('click', logout)
