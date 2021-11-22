import React from "react";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

const App = () => {
    return(<>
    <Switch> 
    <Route path="/" exact component={Join}/>
    <Route path="/chat" exact component={Chat}/>
    </Switch>
    </>)
}
export default App;