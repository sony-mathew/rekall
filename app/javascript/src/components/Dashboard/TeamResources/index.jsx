import React, { useState, useEffect } from "react";
import {
  useParams
} from "react-router-dom";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header } from "neetoui/layouts";

import teamService from "apis/teamService";
import teamResourceService from "apis/teamResourceService";

import ListPage from "./ListPage";
import NewPane from "./NewPane";
import DeleteAlert from "./DeleteAlert";

const TeamResources = () => {
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [team, setTeam] = useState({});
  const [teamResources, setTeamResources] = useState([]);
  

  useEffect(() => {
    fetchTeamResources();
  }, []);

  const fetchTeamResources = async () => {
    try {
      setLoading(true);

      const teamResponse = await teamService.fetch(urlParams.teamId);
      setTeam(teamResponse.data.team);

      const teamResourceResponse = await teamResourceService.fetchAll(teamResponse.data.team.id);
      setTeamResources(teamResourceResponse.data);
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
        title={`Team Resources (${team.name})`}
        actionBlock={
          <Button
            onClick={() => { setCurrrentResource(false); setShowPane(true); } }
            label="Share Resource"
            icon="ri-add-line"
          />
        }
      />
      <div className="w-full flex flex-row space-x-4">
          {teamResources.length ? (
            <>
              <ListPage
                team={team}
                items={teamResources}
                setCurrrentResource={setCurrrentResource}
                showPane={setShowPane}
                currentResource={currentResource}
                setShowDeleteAlert={setShowDeleteAlert}
              />
            </>
          ) : (
            <EmptyState
              image={EmptyNotesListImage}
              title="Looks like you don't have resources!"
              subtitle="Colloborate more with you team members. Share your resources with the team."
              primaryAction={() => setShowPane(true)}
              primaryActionLabel="Share Resource with the Team"
            />
          )}
      </div>
      <NewPane
        showPane={showPane}
        setShowPane={setShowPane}
        fetchResources={fetchTeamResources}
        currentResource={currentResource}
        setCurrrentResource={setCurrrentResource}
        team={team}
      />
      { showDeleteAlert && (
        <DeleteAlert
          selectedResource={currentResource}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchTeamResources}
        />
      ) }
    </>
  );
};

export default TeamResources;
