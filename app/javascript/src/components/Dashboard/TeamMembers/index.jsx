import React, { useState, useEffect } from "react";
import {
  useParams
} from "react-router-dom";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header } from "neetoui/layouts";

import teamService from "apis/teamService";
import teamMemberService from "apis/teamMemberService";

import ListPage from "./ListPage";
import NewPane from "./NewPane";
import DeleteAlert from "./DeleteAlert";

const TeamMembers = () => {
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [team, setTeam] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchTeamMembers();
    return () => { isMounted = false };
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);

      const teamResponse = await teamService.fetch(urlParams.teamId);
      setTeam(teamResponse.data.team);

      const teamMemberResponse = await teamMemberService.fetchAll(teamResponse.data.team.id);
      setTeamMembers(teamMemberResponse.data);
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
        title={`Team Members (${team.name})`}
        actionBlock={
          <Button
            onClick={() => { setCurrrentResource(false); setShowPane(true); } }
            label="Add Team Member"
            icon="ri-add-line"
          />
        }
      />
      <div className="w-full flex flex-row space-x-4">
          {teamMembers.length ? (
            <>
              <ListPage
                team={team}
                items={teamMembers}
                setCurrrentResource={setCurrrentResource}
                showPane={setShowPane}
                currentResource={currentResource}
                setShowDeleteAlert={setShowDeleteAlert}
              />
            </>
          ) : (
            <EmptyState
              image={EmptyNotesListImage}
              title="Looks like you don't have any team members!"
              subtitle="Colloborate more with you team members. Add your team mates to the team."
              primaryAction={() => setShowPane(true)}
              primaryActionLabel="Add Team Members"
            />
          )}
      </div>
      <NewPane
        showPane={showPane}
        setShowPane={setShowPane}
        fetchResources={fetchTeamMembers}
        currentResource={currentResource}
        setCurrrentResource={setCurrrentResource}
        team={team}
      />
      { showDeleteAlert && (
        <DeleteAlert
          selectedResource={currentResource}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchTeamMembers}
        />
      ) }
    </>
  );
};

export default TeamMembers;
