import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import teamService from "apis/teamService";

import ListPage from "./ListPage";
import NewPane from "./NewPane";
import QueryModel from "./../Queries";

const TeamsLanding = () => {
  const [loading, setLoading] = useState(true);
  const [showPane, setshowPane] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [teams, setTeams] = useState([]);
  

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamService.fetchAll();
      setTeams(response.data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <Header
        title="Teams"
        actionBlock={
          <Button
            onClick={() => { setCurrrentResource(false); setshowPane(true); } }
            label="Create Team"
            icon="ri-add-line"
          />
        }
      />
      {teams.length ? (
        <>
          <SubHeader
            searchProps={{
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              clear: () => setSearchTerm(""),
            }}
          />
          <ListPage
            items={teams}
            setCurrrentResource={setCurrrentResource}
            showPane={setshowPane}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any teams!"
          subtitle="Teams are the best way to colloborate. You can share your query groups and api sources to collaborate with your team members."
          primaryAction={() => setshowPane(true)}
          primaryActionLabel="Create Team"
        />
      )}
      <NewPane
        showPane={showPane}
        setShowPane={setshowPane}
        fetchResources={fetchTeams}
        currentResource={currentResource}
        setCurrrentResource={setCurrrentResource}
      />
      {/* showDeleteAlert && (
        <DeleteAlert
          selectedNoteIds={selectedNoteIds}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchApiSources}
        />
      ) */}
    </>
  );
};


const Teams = () => {
  let { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <TeamsLanding />
      </Route>
      <Route path={`${path}/:teamId/members`}>
        <QueryModel />
      </Route>
      <Route path={`${path}/:teamId/resources`}>
        <QueryModel />
      </Route>
    </Switch>
  );
}

export default Teams;
