import React from "react";
import { Pane } from "neetoui";
import NewForm from "./NewForm";

export default function NewPane({ fetchResources, showPane, setShowPane, currentResource, setCurrrentResource, team }) {
  const onClose = () => {
    setCurrrentResource(false);
    setShowPane(false);
  }
  return (
    <Pane title="Share Resource" isOpen={showPane} onClose={onClose}>
      <div className="px-6">
        <NewForm onClose={onClose} refetch={fetchResources} currentResource={currentResource} team={team}/>
      </div>
    </Pane>
  );
}
