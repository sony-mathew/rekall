import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
  useLocation
} from "react-router-dom";
import { Button, PageLoader, Tooltip, Toastr, Label } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import { colorForBinaryRating } from 'common/colorHelper';
import { timeSince } from "common/timeHelper";

import resultService from "apis/resultService";
import snapshotService from "apis/snapshotService";

import ListPage from "./ListPage";

const QueryResult = ({ scorer, queryGroup, query, setCurrrentQuery, showQueryEditPane, setShowDeleteAlert }) => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [currentResource, setCurrrentResource] = useState(false);

  const [queryResult, setQueryResult] = useState({});
  const [userScores, setUserScores] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchQueryResult();
    return () => { isMounted = false };
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

  const createSnapshot =  async () => {
    try {
      setLoading(true);
      const snapshotResponse = await snapshotService.create(urlParams.queryGroupId, urlParams.queryId);
      Toastr.success("Snapshot created successfully.");
      // set snapshotResponse
      // setQueryResult(resultResponse.data.result);
      // setUserScores(resultResponse.data.score);
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
      
      <div className="flex flex-row space-x-4 items-center border-gray-600 p-4 bg-gray-100">
        { queryResult ? (
            <>
              <span className="flex flex-row pl-4">
                <span className="rounded-md text-white text-xl font-semibold pr-2 pl-2 pt-1 pb-1"
                    style={{backgroundColor: colorForBinaryRating(queryResult.latest_score || 0.0)}}
                  > { (queryResult.latest_score || 0.0).toFixed(2) }
                </span>
                <Tooltip content={`Scorer: ${scorer.name}, Updated: ${timeSince(new Date(queryResult.updated_at))} ago`} position="bottom" minimal>
                  <i className="ri-question-line text-xl ml-2"></i>
                </Tooltip>
              </span>
            </>
          ) : null }
        <Button
            onClick={() => { createSnapshot(); } }
            label="Create Snapshot"
            icon="ri-refresh-line"
          />
        <NavLink
          to={`/query_groups/${urlParams.queryGroupId}/queries/${urlParams.queryId}/snapshots`}
          className="border round p-2 pr-4 pl-4"
        >
          <Tooltip content={`Result Snapshots`} position="bottom" minimal>
            <div className="rounded items-center justify-center">
              Snapshots &gt;
            </div>
          </Tooltip>
        </NavLink>
      </div>
      
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
