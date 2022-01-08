import React from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea } from "neetoui/formik";
import { Button } from "neetoui";
import scorerService from "apis/scorerService";

export default function NewForm({ onClose, refetch, currentResource }) {
  const handleSubmit = async resource => {
    try {
      if(currentResource) {
        await scorerService.update(currentResource.id, resource);
      } else {
        await scorerService.create(resource);
      }
      refetch();
      onClose();
    } catch (err) {
      logger.error(err);
    }
  };

  const getInitialValues = () => {
    const resourceObj = currentResource || {
      name: "",
      scale_type: "",
      code: ""
    };
    return resourceObj;
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        name: yup.string().required("Name is required"),
        scale_type: yup.string().required("Scale Type is required"),
        code: yup.string().required("Code is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Name" name="name" className="mb-6" />
          <Input label="Scale Type" name="environment" className="mb-6" />
          <Textarea label="Scorer Algorithm Code" name="code" rows={8} className="mb-24"/>
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
