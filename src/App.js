import './App.css';
import React from "react";
import { Switch, Route } from "react-router-dom";
import Welcome from './components/welcome/Welcome';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import VerifyOtp from './components/verifyOtp/verifyOtp';
import Home from "./components/home/Home";
import GetMail from './components/forgotPassword/GetMail';
import SetPassword from "./components/forgotPassword/SetPassword";
import Question from './components/Question/Question';
import Setting from './components/Settings/Setting';
import ChangeName from './components/Settings/ChangeName';
import ChangePassword from './components/Settings/ChangePassword';
import ChangeEmail from './components/Settings/ChangeEmail';
import ChangeProfession from './components/Settings/ChangeProfession';
import ChangeCollege from './components/Settings/ChangeCollege';
import VerifyChangeEmailOtp from './components/Settings/VerifyChangeEmailOtp';
function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/signup/verify" component={VerifyOtp} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login/forgotpassword/setpassword" component={SetPassword} />
        <Route exact path="/login/forgotpassword/verifyemail" component={VerifyOtp} />
        <Route exact path="/login/forgotpassword" component={GetMail} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/home/question/:id" component={Question} />
        <Route exact path="/home/settings/changecollege" component={ChangeCollege} />
        <Route exact path="/home/settings/changeprofession" component={ChangeProfession} />
        <Route exact path="/home/settings/changeemail/verifyemail" component={VerifyChangeEmailOtp} />
        <Route exact path="/home/settings/changeemail" component={ChangeEmail} />
        <Route exact path="/home/settings/changepassword" component={ChangePassword} />
        <Route exact path="/home/settings/changename" component={ChangeName} />
        <Route exact path="/home/settings" component={Setting} />
        <Route exact path="/home" component={Home} />
        <Route path="/" component={Welcome} />
      </Switch>
    </React.Fragment>
  );
}
export default App;
