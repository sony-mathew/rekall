import React from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea } from "neetoui/formik";
import { Button } from "neetoui";
import apiSourceService from "apis/apiSourceService";

export default function NewApiSourceForm({ onClose, refetch }) {
  const handleSubmit = async values => {
    try {
      await apiSourceService.create(values);
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };
  return (
    <Formik
      initialValues={{
        name: "",
        host: "",
        environment: "",
        request: ""
      }}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        name: yup.string().required("Name is required"),
        host: yup.string().required("Host is required"),
        environment: yup.string().required("Host is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Name" name="name" className="mb-6" />
          <Input label="Environment" name="environment" className="mb-6" />
          <Input label="Host" name="host" className="mb-6" />
          <Textarea label="Request" name="request" rows={8} />
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
