import React from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea } from "neetoui/formik";
import { Button } from "neetoui";
import apiSourceService from "apis/apiSourceService";

import { serializeObject, deserializeObject } from "common/jsonHelper";

export default function NewApiSourceForm({ onClose, refetch, apiSource }) {
  const handleSubmit = async resource => {
    try {
      resource.request = deserializeObject(resource.request);
      if(apiSource) {
        await apiSourceService.update(apiSource.id, resource);
      } else {
        await apiSourceService.create(resource);
      }
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };

  const getInitialValues = () => {
    const resourceObj = apiSource || {
      name: "",
      host: "",
      environment: "",
      request: {}
    };
    resourceObj.request = serializeObject(resourceObj.request);
    return resourceObj;
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        name: yup.string().required("Name is required"),
        host: yup.string().required("Host is required"),
        environment: yup.string().required("Environment is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Name" name="name" className="mb-6" />
          <Input label="Environment" name="environment" className="mb-6" />
          <Input label="Host" name="host" className="mb-6" />
          <Textarea label="Request Headers" name="request" rows={8} className="mb-24"/>
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
