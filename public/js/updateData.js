import axios from 'axios'
import { showAlert } from './alerts'

export const updateData = async (data, type) => {
  try {
    let url =
      type === 'data'
        ? 'http://localhost:3000/v1/users/updateme'
        : 'http://localhost:3000/v1/auth/updatepassword'

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    })

    if (res.data.status === 'Success') {
      showAlert('success', 'Details updated successfully')
    }
  } catch (err) {
    showAlert('error', err.message)
  }
}
