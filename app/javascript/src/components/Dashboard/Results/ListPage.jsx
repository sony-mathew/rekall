import React, { useState, useEffect } from "react";
import { Button, Card } from "neetoui";

export default function ListPage({
  queryGroup,
  scorer,
  items = [],
  setCurrrentResource
}) {

  const [showRatingPaneFor, setShowRatingPaneFor] = useState(false);

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
            onClick={() => { setCurrrentResource(doc); setShowRatingPaneFor(doc); } }
            label=""
            icon="ri-user-star-line"
          />
        </div>
      </div>
    </>);
  }

  const getRatingsPanelFor = (doc) => {
    const rateDoc = (value) => {
      setShowRatingPaneFor(false);
      console.log(value, doc);
    };

    return (
      <div className="rounded-xl flex flex-row space-x-2 p2 bg-pink-100 p-4">
        {scorer.scale.map((scaleValue) => {
          return (<Button key={scaleValue} onClick={() => rateDoc(scaleValue)} label={scaleValue}/>);
        })}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col px-4 space-y-2">
      {items.map(doc => (
        <Card key={doc[queryGroup['document_uuid']]} className="relative">
          <Card.Title>{doc[queryGroup['document_uuid']]}</Card.Title>
          <div>{getFieldsFor(doc)}</div>
          { (showRatingPaneFor &&  showRatingPaneFor === doc) ? 
              (<div className="absolute inset-y-1/4 right-4">{getRatingsPanelFor(doc)}</div>)
              : ''
          }
        </Card>
      ))}
    </div>
  );
}
