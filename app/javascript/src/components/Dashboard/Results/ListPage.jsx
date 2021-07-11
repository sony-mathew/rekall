import React from "react";
import { Button, Card } from "neetoui";

export default function ListPage({
  queryGroup,
  items = [],
  setCurrrentResource,
  showPane
}) {

  const getFieldsFor = (doc) => {
    return (
      <>
      <div className="flex flex-row space-x-4 text-gray-900">
        <div className="flex-1 flex flex-col">
          {queryGroup['document_fields'].map(field => {
            return (
              <div key={field} className="flex flex-row space-x-4 text-gray-900">
                <div>{field}: </div>
                <div>{doc[field]}</div>
              </div>
            );
          })}
        </div>
        <div>
          <Button
            onClick={() => { setCurrrentResource(doc); showPane(true); } }
            label=""
            icon="ri-user-star-line"
          />
        </div>
      </div>
    </>);
  }

  return (
    <div className="w-full flex flex-col px-4 space-y-2">
      {items.map(doc => (
        <Card key={doc[queryGroup['document_uuid']]}>
          <Card.Title>{doc[queryGroup['document_uuid']]}</Card.Title>
          <div>{getFieldsFor(doc)}</div>
        </Card>
      ))}
    </div>
  );
}
