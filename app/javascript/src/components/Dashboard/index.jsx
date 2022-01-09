import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import Navbar from "components/Common/Navbar";

import PasswordEdit from "./Account/Passwords/Edit";
import Profile from "./Account/Profile";
import ApiSources from "./ApiSources";
import QueryGroups from "./QueryGroups";
import Teams from "./Team";
import Scorers from "./Scorers";

const Home = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
      <div className="flex flex-col items-start justify-start flex-grow h-screen overflow-y-auto">
        <Switch>
          <Route exact path="/api_sources" component={ApiSources} />
          <Route exact path="/my/password/edit" component={PasswordEdit} />
          <Route exact path="/my/profile" component={Profile} />
          <Route path="/query_groups" component={QueryGroups} />
          <Route path="/scorers" component={Scorers} />
          <Route path="/teams" component={Teams} />
          <Redirect from="/" to="/api_sources" />
        </Switch>
      </div>
    </div>
  );
};

export default Home;
