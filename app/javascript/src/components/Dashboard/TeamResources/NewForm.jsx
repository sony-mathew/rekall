import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Select } from "neetoui/formik";
import { Button } from "neetoui";

import teamResourceService from "apis/teamResourceService";
import apiSourceService from "apis/apiSourceService";
import queryGroupService from "apis/queryGroupService";

const getList = async (service) => {
  const response = await service.fetchAll();
  return response.data.map((resource) => ({ value: resource.id, label: resource.name }));
}

const preProcessObject = (resource) => {
  if(typeof resource.resourceable_type === 'object' && resource.resourceable_type !== null) {
    resource.resourceable_type = resource.resourceable_type.value;
  }
  if(typeof resource.resourceable_id === 'object' && resource.resourceable_id !== null) {
    resource.resourceable_id = resource.resourceable_id.value;
  }
  return resource;
}

const defaultValues = (currentResource) => {
  let resourceObj = currentResource || {
    resourceable_type: { value: "QueryGroup", label: "Query Group" }
  };

  return resourceObj;
}


export default function NewForm({ onClose, refetch, currentResource, team }) {
  const [_loading, setLoading] = useState(false);
  const [resourceObject, _setResourceObject] = useState(defaultValues(currentResource));
  const [queryGroupsOptions, setQueryGroupsOptions] = useState([]);
  const [sourcesOptions, setSourcesOptions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryGroupsList = await getList(queryGroupService);
      setQueryGroupsOptions(queryGroupsList);
      const sourcesList = await getList(apiSourceService);
      setSourcesOptions(sourcesList);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    try {
      if(currentResource) {
        await teamResourceService.update(team.id, currentResource.id, preProcessObject(values));
      } else {
        await teamResourceService.create(team.id, preProcessObject(values));
      }
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };

  return (
    <Formik
      initialValues={resourceObject}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <Select
            label="Resource Type"
            placeholder="Select a resource type"
            name="resourceable_type"
            options={[
              { value: "ApiSource", label: "API Source" },
              { value: "QueryGroup", label: "Query Group" },
            ]}
            className="mb-6"
          />
          {
            values.resourceable_type && values.resourceable_type.value == 'ApiSource' ? 
            <Select
              label="Api Source"
              placeholder="Select a source"
              name="resourceable_id"
              options={sourcesOptions}
              className="mb-6"
            /> : <Select
            label="Query Group"
            placeholder="Select a query group"
            name="resourceable_id"
            options={queryGroupsOptions}
            className="mb-6"
          />
          }
          <div className="nui-pane__footer nui-pane__footer--absolute">
            <Button
              onClick={onClose}
              label="Cancel"
              size="large"
              style="secondary"
            />

            <Button
              type="submit"
              label="Submit"
              size="large"
              style="primary"
              className="ml-2"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
