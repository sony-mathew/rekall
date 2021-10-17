import React, { useState } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea } from "neetoui/formik";
import { Button } from "neetoui";

import teamService from "apis/teamService";

const defaultValues = (currentResource) => {
  let resourceObj = currentResource || {
    name: '',
    description: ''
  };
  return resourceObj;
}

export default function NewForm({ onClose, refetch, currentResource }) {
  const [resourceObject, _] = useState(defaultValues(currentResource));

  const handleSubmit = async values => {
    try {
      if(currentResource) {
        await teamService.update(currentResource.id, values);
      } else {
        await teamService.create(values);
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
        name: yup.string().required("Name is required"),
        description: yup.string().required("Description is required")
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Name" name="name" className="mb-6" />
          <Textarea label="Description" name="description" rows={8} className="mb-6" />

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
