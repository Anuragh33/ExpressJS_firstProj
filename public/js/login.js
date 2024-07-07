import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/v1/auth/login',
      data: {
        email,
        password,
      },
    })

    if (res.data.status === 'Success') {
      showAlert('success', 'Logged In Successfully')
      window.setTimeout(() => {
        location.assign('/')
      }, 1000)
    }
  } catch (err) {
    // console.log(err.response)
    showAlert('error', err.message)
  }
}
