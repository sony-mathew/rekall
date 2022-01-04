import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import { Button, PageLoader, Tooltip } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header } from "neetoui/layouts";

import snapshotService from "apis/snapshotService";

import ListPage from "./ListPage";

const Snapshot = ({ scorer, queryGroup, query, setCurrrentQuery, showQueryEditPane, setShowDeleteAlert }) => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();
  let history = useHistory();

  const [loading, setLoading] = useState(true);
  const [currentResource, setCurrrentResource] = useState(false);

  const [snapshots, setSnapshots] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchSnapshots();
    return () => { isMounted = false };
  }, [url]);

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      const snapshotsListResponse = await snapshotService.fetchAll(urlParams.queryGroupId, urlParams.queryId);
      setSnapshots(snapshotsListResponse.data.snapshots);
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
        title="Snapshots"
        actionBlock={
          <div className="flex flex-row space-x-4 items-center">
            <Button
              onClick={() => history.push(`/query_groups/${urlParams.queryGroupId}/queries/${urlParams.queryId}/results`) }
              label="Back"
              icon="ri-arrow-left-line"
            />
          </div>
        }
      />
      {snapshots ? (
        <>
          <ListPage
            scorer={scorer}
            queryGroup={queryGroup}
            query={query}
            items={snapshots}
            setCurrrentResource={setCurrrentResource}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any snapshots!"
          subtitle="Snapshots are copies of results and scores frozen in time."
          primaryAction={() => history.push(`/query_groups/${urlParams.queryGroupId}/queries/${urlParams.queryId}/results`)}
          primaryActionLabel="Create Snapshots from the Results"
        />
      )}
    </>
  );
};

export default Snapshot;
