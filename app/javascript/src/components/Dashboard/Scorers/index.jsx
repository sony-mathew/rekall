import React, { useState, useEffect } from "react";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import scorerService from "apis/scorerService";

import ListPage from "./ListPage";
import NewApiSourcePane from "./Pane";
import DeleteAlert from "./DeleteAlert";

const Scorers = () => {
  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);
  const [currentScorer, setCurrentScorer] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scorers, setScorers] = useState([]);
  

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchScorers();
    return () => { isMounted = false };
  }, []);

  const fetchScorers = async () => {
    try {
      setLoading(true);
      const response = await scorerService.fetchAll();
      setScorers(response.data);
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
        title="Api Sources"
        actionBlock={
          <Button
            onClick={() => { setCurrentScorer(false); setShowPane(true); } }
            label="Create Api Source"
            icon="ri-add-line"
          />
        }
      />
      {scorers.length > 0 ? (
        <>
          <SubHeader
            searchProps={{
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              clear: () => setSearchTerm(""),
            }}
          />
          <ListPage
            items={scorers}
            setCurrentResource={setCurrentScorer}
            showPane={setShowPane}
            setShowDeleteAlert={setShowDeleteAlert}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any Scorers!"
          subtitle="Add your scorers to rate the search query results with."
          primaryAction={() => setShowPane(true)}
          primaryActionLabel="Create Scorer"
        />
      )}
      <NewApiSourcePane
        showPane={showPane}
        setShowPane={setShowPane}
        refetchData={fetchScorers}
        currentResource={currentScorer}
        setCurrentResource={setCurrentScorer}
      />
      { showDeleteAlert && (
        <DeleteAlert
          selectedResource={currentScorer}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchScorers}
        />
      ) }
    </>
  );
};

export default Scorers;
