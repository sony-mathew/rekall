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

import { timeSince } from "common/timeHelper";

import queryGroupService from "apis/queryGroupService";
import scorerService from "apis/scorerService";
import queryService from "apis/queryService";
import resultService from "apis/resultService";

import ListPage from "./ListPage";

const QueryResult = ({ setCurrrentQuery, showQueryEditPane }) => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [currentResource, setCurrrentResource] = useState(false);
  
  const [queryGroup, setQueryGroup] = useState(false);
  const [scorer, setScorer] = useState(false);
  const [query, setQuery] = useState(false);
  const [queryResult, setQueryResult] = useState(false);

  useEffect(() => {
    fetchQueryResult();
  }, [url]);

  const fetchQueryResult = async () => {
    try {
      setLoading(true);

      const queryGroupResponse = await queryGroupService.fetch(urlParams.queryGroupId);
      setQueryGroup(queryGroupResponse.data.query_group);

      const scorerResponse = await scorerService.fetch(queryGroupResponse.data.query_group.scorer_id);
      setScorer(scorerResponse.data.scorer);

      const queryResponse = await queryService.fetch(urlParams.queryGroupId, urlParams.queryId);
      setQuery(queryResponse.data.query);

      const resultResponse = await resultService.fetchAll(urlParams.queryGroupId, urlParams.queryId);
      setQueryResult(resultResponse.data.result);
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
          <div className="flex flex-row space-x-4 items-center">
            { queryResult ? (<div className="text-xs text-gray-300">
              (Updated {timeSince(new Date(queryResult.updated_at))} ago)
            </div>) : null }
            <Button
              onClick={() => { setCurrrentQuery(query); showQueryEditPane(true); } }
              label="Edit Query"
              icon="ri-pencil-line"
            />
            <Button
              onClick={() => { refetchResults(); } }
              label="Refetch Results"
              icon="ri-refresh-line"
            />
          </div>
        }
      />
      {queryResult ? (
        <>
          <ListPage
            queryGroup={queryGroup}
            scorer={scorer}
            items={queryResult.data}
            setCurrrentResource={setCurrrentResource}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any results!"
          subtitle="Query results represent the actual result of query on the source."
          primaryAction={() => refetchResults()}
          primaryActionLabel="Fetch Results From Source"
        />
      )}
    </>
  );
};

export default QueryResult;
