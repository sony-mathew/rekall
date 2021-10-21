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
import { Button, PageLoader, Tooltip } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import { colorForBinaryRating } from 'common/colorHelper';
import { timeSince } from "common/timeHelper";

import resultService from "apis/resultService";

import ListPage from "./ListPage";

const QueryResult = ({ scorer, queryGroup, query, setCurrrentQuery, showQueryEditPane, setShowDeleteAlert }) => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [currentResource, setCurrrentResource] = useState(false);

  const [queryResult, setQueryResult] = useState({});
  const [userScores, setUserScores] = useState({});

  useEffect(() => {
    fetchQueryResult();
  }, [url]);

  const fetchQueryResult = async () => {
    try {
      setLoading(true);
      const resultResponse = await resultService.fetchAll(urlParams.queryGroupId, urlParams.queryId);
      setQueryResult(resultResponse.data.result);
      setUserScores(resultResponse.data.score);
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
      setUserScores(resultResponse.data.score);
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
            { queryResult ? (
                <>
                  <Tooltip content="Results Last Refreshed At" position="bottom" minimal>
                    <div className="text-xs text-gray-400">
                      (Updated {timeSince(new Date(queryResult.updated_at))} ago)
                    </div>
                  </Tooltip>
                  <Tooltip content={`Latest Score (${scorer.name})`} position="bottom" minimal>
                    <div className="rounded-md text-white text-xl font-semibold pr-2 pl-2 pt-0.5 pb-0.5"
                      style={{backgroundColor: colorForBinaryRating(queryResult.latest_score || 0.0)}}
                      > { (queryResult.latest_score || 0.0).toFixed(2) }
                    </div>
                  </Tooltip>
                </>
              ) : null }
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
            <Button
              onClick={() => { setShowDeleteAlert(true); } }
              label=""
              icon="ri-delete-bin-7-line"
              style="danger"
            />
          </div>
        }
      />
      {queryResult ? (
        <>
          <ListPage
            scorer={scorer}
            queryGroup={queryGroup}
            query={query}
            queryResult={queryResult}
            items={queryResult.data}
            setCurrrentResource={setCurrrentResource}
            refreshQueryResult={fetchQueryResult}
            scores={userScores}
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
