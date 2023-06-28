import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginPage extends Component {
  state = {errorMessage: '', Username: '', Password: ''}

  onChangeUserName = event => {
    this.setState({Username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({Password: event.target.value})
  }

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailureLogin = errorMsg => {
    this.setState({errorMessage: errorMsg})
  }

  onSubmitDetails = async event => {
    event.preventDefault()
    const {Username, Password} = this.state
    const userDetails = {username: Username, password: Password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const loginUrl = 'https://apis.ccbp.in/login'
    const response = await fetch(loginUrl, options)
    const jsonData = await response.json()
    if (response.ok === true) {
      this.onSuccessLogin(jsonData.jwt_token)
    } else {
      this.onFailureLogin(jsonData.error_msg)
    }
  }

  render() {
    const {errorMessage, Username, Password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onSubmitDetails}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label htmlFor="username" className="label-element">
            USERNAME
          </label>
          <input
            type="text"
            className="input-element"
            id="username"
            placeholder="Username"
            value={Username}
            onChange={this.onChangeUserName}
          />
          <label htmlFor="password" className="label-element">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            className="input-element"
            placeholder="Password"
            onChange={this.onChangePassword}
            value={Password}
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    )
  }
}

export default LoginPage
