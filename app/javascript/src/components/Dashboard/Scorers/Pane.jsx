import React from "react";
import { Pane } from "neetoui";
import NewForm from "./Form";

export default function NewApiSourcePane({ refetchData, showPane, setShowPane, currentResource, setCurrentResource }) {
  const onClose = () => {
    setCurrentResource(false);
    setShowPane(false);
  }
  return (
    <Pane title={`${currentResource ? 'Edit' : 'Create'} Scorer`} isOpen={showPane} onClose={onClose}>
      <div className="px-6">
        <NewForm onClose={onClose} refetch={refetchData} currentResource={currentResource} />
      </div>
    </Pane>
  );
}
