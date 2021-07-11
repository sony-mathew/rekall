import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import queryGroupService from "apis/queryGroupService";
import resultService from "apis/resultService";

import ListPage from "./ListPage";

const QueryResult = () => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [showPane, setshowPane] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const [queryGroup, setQueryGroup] = useState([]);
  

  useEffect(() => {
    fetchQueryResult();
  }, [url]);

  const fetchQueryResult = async () => {
    try {
      setLoading(true);
      const resultResponse = await resultService.fetchAll(urlParams.queryGroupId, urlParams.queryId);
      setQueryResult(resultResponse.data.result);
      const queryGroupResponse = await queryGroupService.fetch(urlParams.queryGroupId);
      setQueryGroup(queryGroupResponse.data.query_group);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refetchResults =  async () => {
    try {
      setLoading(true);
      const resultResponse = await resultService.fetch_fresh_results(urlParams.queryGroupId, urlParams.queryId);
      setQueryResult(resultResponse.data.result);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <Header
        title="Results"
        actionBlock={
          <Button
            onClick={() => { setCurrrentResource(false); setshowPane(true); refetchResults(); } }
            label="Refetch Results"
            icon="ri-refresh-line"
          />
        }
      />
      {queryResult ? (
        <>
          <ListPage
            queryGroup={queryGroup}
            items={queryResult.data}
            setCurrrentResource={setCurrrentResource}
            showPane={setshowPane}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any results!"
          subtitle="Query results represent the actual result of query on the source."
          primaryAction={() => setshowPane(true)}
          primaryActionLabel="Refresh the results."
        />
      )}
    </>
  );
};

export default QueryResult;
