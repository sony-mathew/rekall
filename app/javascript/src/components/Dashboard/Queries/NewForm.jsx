import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea, Select } from "neetoui/formik";
import { Button } from "neetoui";

import { serializeObject, deserializeObject } from "common/jsonHelper";
import queryService from "apis/queryService";
import queryGroupService from "apis/queryGroupService";

const getList = async (service) => {
  const response = await service.fetchAll();
  return response.data.map((resource) => ({ value: resource.id, label: resource.name }));
}

const preProcessObject = (resource) => {
  if(typeof resource.query_group_id === 'object' && resource.query_group_id !== null) {
    resource.query_group_id = resource.query_group_id.value;
  }
  return resource;
}

const defaultValues = (currentResource) => {
  let resourceObj = currentResource || {
    query_text: "",
    notes: "",
    query_group_id: 0
  };

  return resourceObj;
}


export default function NewForm({ onClose, refetch, currentResource }) {
  const [loading, setLoading] = useState(true);
  const [resourceObject, setResourceObject] = useState(defaultValues(currentResource));
  const [showQueryStringField, setShowQueryStringField] = useState(resourceObject.http_method === 'GET');
  const [queryGroupsOptions, setQueryGroupsOptions] = useState([]);

  useEffect(() => {
    fetchQueryGroups();
  }, []);

  const fetchQueryGroups = async () => {
    try {
      setLoading(true);
      const queryGroupsList = await getList(queryGroupService);
      setQueryGroupsOptions(queryGroupsList);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    try {
      const processedValues = preProcessObject(values);
      if(currentResource) {
        await queryService.update(processedValues.query_group_id, currentResource.id, processedValues);
      } else {
        await queryService.create(processedValues.query_group_id, processedValues);
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
      validationSchema={yup.object({
        query_text: yup.string().required("Name is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Query" name="query_text" className="mb-6" />
          <Textarea label="Notes" name="notes" rows={8} className="mb-6" />
          <Select
            label="Query Group"
            placeholder="Select an Option"
            isDisabled={false}
            isClearable={true}
            isSearchable={true}
            name="query_group_id"
            options={queryGroupsOptions}
            className="mb-6"
          />
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
