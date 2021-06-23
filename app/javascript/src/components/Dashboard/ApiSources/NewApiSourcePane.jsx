import React from "react";
import { Pane } from "neetoui";
import NewApiSourceForm from "./NewApiSourceForm";

export default function NewApiSourcePane({ fetchApiSources, showPane, setShowPane }) {
  const onClose = () => setShowPane(false);
  return (
    <Pane title="Create a New Note" isOpen={showPane} onClose={onClose}>
      <div className="px-6">
        <NewApiSourceForm onClose={onClose} refetch={fetchApiSources} />
      </div>
    </Pane>
  );
}
