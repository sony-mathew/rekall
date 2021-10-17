import React, { useState } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { Input, Select } from "neetoui/formik";
import { Button } from "neetoui";

import teamMemberService from "apis/teamMemberService";

const preProcessObject = (resource) => {
  if(typeof resource.role === 'object' && resource.role !== null) {
    resource.role = resource.role.value;
  }
  return resource;
}

const defaultValues = (currentResource) => {
  let resourceObj = {
    email: "",
    role: "admin"
  };

  if (currentResource) {
    resourceObj = {
      email: currentResource.member.email,
      role: currentResource.role
    };
  }

  return resourceObj;
}


export default function NewForm({ onClose, refetch, currentResource, team }) {
  const [resourceObject, setResourceObject] = useState(defaultValues(currentResource));

  const handleSubmit = async values => {
    try {
      if(currentResource) {
        await teamMemberService.update(team.id, currentResource.member.id, preProcessObject(values));
      } else {
        await teamMemberService.create(team.id, preProcessObject(values));
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
        email: yup.string().required("Email is required"),
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <Input label="Email" name="email" className="mb-6" />
          <Select
            label="Role"
            placeholder="Select a Role"
            name="role"
            options={[
              { value: "admin", label: "Admin" },
              { value: "viewer", label: "Viewer" },
            ]}
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
