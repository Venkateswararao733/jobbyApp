import {Switch, Redirect, Route} from 'react-router-dom'
import ProtectedRoute from './Components/ProtectedRoute'
import LoginPage from './Components/LoginPage'
import Home from './Components/Home'
import JobsPage from './Components/JobsPage'
import JobItemDetails from './Components/JobItemDetails'
import NotFound from './Components/NotFound'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={JobsPage} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
