import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useParams,
  useRouteMatch
} from "react-router-dom";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header } from "neetoui/layouts";

import queryGroupService from "apis/queryGroupService";
import scorerService from "apis/scorerService";
import queryService from "apis/queryService";

import ListPage from "./ListPage";
import NewPane from "./NewPane";
import QueryResult from "./../Results";
import DeleteAlert from "./DeleteAlert";

const QueryModel = () => {
  let { path } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [showPane, setShowPane] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);

  const [queryGroup, setQueryGroup] = useState(false);
  const [scorer, setScorer] = useState(false);
  const [queries, setQueries] = useState([]);
  

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);

      const queryGroupResponse = await queryGroupService.fetch(urlParams.queryGroupId);
      setQueryGroup(queryGroupResponse.data.query_group);

      const scorerResponse = await scorerService.fetch(queryGroupResponse.data.query_group.scorer_id);
      setScorer(scorerResponse.data.scorer);

      const response = await queryService.fetchAll(urlParams.queryGroupId);
      setQueries(response.data);
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
        title="Queries"
        actionBlock={
          <Button
            onClick={() => { setCurrrentResource(false); setShowPane(true); } }
            label="Add New Query"
            icon="ri-add-line"
          />
        }
      />
      <div className="w-full flex flex-row space-x-4">
        <div className="w-4/12">
            {queries.length ? (
            <>
              <ListPage
                queryGroup={queryGroup}
                items={queries}
                scorer={scorer}
                setCurrrentResource={setCurrrentResource}
                showPane={setShowPane}
                currentResource={currentResource}
              />
            </>
          ) : (
            <EmptyState
              image={EmptyNotesListImage}
              title="Looks like you don't have any queries!"
              subtitle="Query groups represent a group of queries with same request settings. Add your query groups and add add queries in them."
              primaryAction={() => setShowPane(true)}
              primaryActionLabel="Add New Query"
            />
          )}
        </div>
        <div className="w-full flex-1">
          <Switch>
            <Route path={`${path}/:queryId/results`}>
              <QueryResult 
                setCurrrentQuery={setCurrrentResource} 
                showQueryEditPane={setShowPane} 
                setShowDeleteAlert={setShowDeleteAlert} 
                query={currentResource} 
                scorer={scorer} 
                queryGroup={queryGroup} />
            </Route>
            <Route>
              <div> No query selected. </div>
            </Route>
          </Switch>
        </div>
      </div>
      <NewPane
        showPane={showPane}
        setShowPane={setShowPane}
        fetchResources={fetchQueries}
        currentResource={currentResource}
        setCurrrentResource={setCurrrentResource}
      />
      { showDeleteAlert && (
        <DeleteAlert
          selectedResource={currentResource}
          onClose={() => setShowDeleteAlert(false)}
          refetch={fetchQueries}
        />
      ) }
    </>
  );
};

export default QueryModel;
