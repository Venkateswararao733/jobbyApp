import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {RiWalletFill} from 'react-icons/ri'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Headers = props => {
  const onClickLogOutBtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="navbar-container">
      <Link to="/" className="link-item">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <ul className="headers-mobile-view">
        <li className="logo-item">
          <Link to="/" className="link-item">
            <AiFillHome className="react-logo" />
          </Link>
        </li>
        <li className="logo-item">
          <Link to="/jobs" className="link-item">
            <RiWalletFill className="react-logo" />
          </Link>
        </li>
        <li className="logo-item">
          <button
            type="button"
            className="log-out-btn"
            onClick={onClickLogOutBtn}
          >
            <FiLogOut className="react-logo" />
          </button>
        </li>
      </ul>
      <ul className="headers-desktop-view">
        <li className="logo-item">
          <Link to="/" className="link-item">
            Home
          </Link>
        </li>
        <li className="logo-item">
          <Link to="/jobs" className="link-item">
            Jobs
          </Link>
        </li>
      </ul>
      <button
        type="button"
        className="log-out-btn-desktop"
        onClick={onClickLogOutBtn}
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Headers)
