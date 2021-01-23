import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Archived from "./pages/Archived";
import Items from "./pages/Items";
import TablePage from "./pages/TablePage";
import UserMenu from "./pages/UserMenu";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact strict path="/">
          <Home />
        </Route>
        <Route path="/AdminLogin">
          <AdminLogin />
        </Route>
        <Route path="/Admin">
          <Admin />
        </Route>
        <Route path="/Archived">
          <Archived />
        </Route>
        <Route path="/Items">
          <Items />
        </Route>
        <Route path="/table">
          <TablePage />
        </Route>
        <Route path="/UserMenu">
          <UserMenu />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

