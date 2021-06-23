import React, { useState, useEffect } from "react";
import apiSourceService from "apis/apiSourceService";
import { Button, PageLoader } from "neetoui";
import EmptyState from "components/Common/EmptyState";
import EmptyNotesListImage from "images/EmptyNotesList";
import { Header, SubHeader } from "neetoui/layouts";

import ApiSourcesTable from "./ApiSourcesTable";
import NewApiSourcePane from "./NewApiSourcePane";
// import DeleteAlert from "./DeleteAlert";

const ApiSources = () => {
  const [loading, setLoading] = useState(true);
  const [showApiSourcePane, setShowApiSourcePane] = useState(false);
  const [currentApiSource, setCurrrentApiSource] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiSources, setApiSources] = useState([]);
  

  useEffect(() => {
    fetchApiSources();
  }, []);

  const fetchApiSources = async () => {
    try {
      setLoading(true);
      const response = await apiSourceService.fetchAll();
      setApiSources(response.data);
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
            onClick={() => { setCurrrentApiSource(false); setShowApiSourcePane(true); } }
            label="Add New Api Source"
            icon="ri-add-line"
          />
        }
      />
      {apiSources.length ? (
        <>
          <SubHeader
            searchProps={{
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value),
              clear: () => setSearchTerm(""),
            }}
          />
          <ApiSourcesTable
            apiSources={apiSources}
            setCurrrentApiSource={setCurrrentApiSource}
            showPane={setShowApiSourcePane}
          />
        </>
      ) : (
        <EmptyState
          image={EmptyNotesListImage}
          title="Looks like you don't have any Api Sources!"
          subtitle="Add your sources to send search queries to them."
          primaryAction={() => setShowApiSourcePane(true)}
          primaryActionLabel="Add New Api Source"
        />
      )}
      <NewApiSourcePane
        showPane={showApiSourcePane}
        setShowPane={setShowApiSourcePane}
        fetchApiSources={fetchApiSources}
        apiSource={currentApiSource}
        setCurrrentApiSource={setCurrrentApiSource}
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

export default ApiSources;
