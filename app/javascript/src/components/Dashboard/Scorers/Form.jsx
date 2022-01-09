import React from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Textarea, Select } from "neetoui/formik";
import { Button } from "neetoui";
import scorerService from "apis/scorerService";

export default function NewForm({ onClose, refetch, currentResource }) {
  const handleSubmit = async resource => {
    if(typeof resource.scale_type === 'object' && resource.scale_type !== null) {
      resource.scale_type = resource.scale_type.value;
    }

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
      scale_type: "graded",
      code: ""
    };
    return resourceObj;
  };

  const isCommunityScorer = currentResource && currentResource.id && !currentResource.user_id;

  return (
    <Formik
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      validationSchema={yup.object({
        name: yup.string().required("Name is required"),
        code: yup.string().required("Code is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Name" name="name" className="mb-6" disabled={isCommunityScorer} />
          <Select
            label="Scale"
            placeholder="Select an Option"
            name="scale_type"
            options={[
              { value: "binary", label: "Binary" },
              { value: "graded", label: "Graded" },
              { value: "detailed", label: "Detailed" },
            ]}
            disabled={isCommunityScorer}
            className="mb-6"
          />
          <Textarea label="Scorer Algorithm Code" name="code" rows={8} className="mb-24" disabled={isCommunityScorer}/>
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
              disabled={isCommunityScorer || isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
