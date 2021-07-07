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

import queryService from "apis/queryService";

import ListPage from "./ListPage";
import NewPane from "./NewPane";
// import DeleteAlert from "./DeleteAlert";

const QueryModel = () => {
  let { path, url } = useRouteMatch();
  let urlParams = useParams();

  const [loading, setLoading] = useState(true);
  const [showPane, setshowPane] = useState(false);
  const [currentResource, setCurrrentResource] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [queries, setQueries] = useState([]);
  

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
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
            onClick={() => { setCurrrentResource(false); setshowPane(true); } }
            label="New Query"
            icon="ri-add-line"
          />
        }
      />
      {queries.length ? (
        <>
          <SubHeader
            searchProps={{
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              clear: () => setSearchTerm(""),
            }}
          />
          <ListPage
            items={queries}
            setCurrrentResource={setCurrrentResource}
            showPane={setshowPane}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any queries!"
          subtitle="Query groups represent a group of queries with same request settings. Add your query groups and add add queries in them."
          primaryAction={() => setshowPane(true)}
          primaryActionLabel="Add New Query"
        />
      )}
      <NewPane
        showPane={showPane}
        setShowPane={setshowPane}
        fetchResources={fetchQueries}
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

export default QueryModel;
