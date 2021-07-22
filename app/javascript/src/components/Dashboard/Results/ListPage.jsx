import React, { useState, useEffect } from "react";
import { Button, Card } from "neetoui";

import { colorForScaleValue } from 'common/colorHelper';
import resultService from "apis/resultService";

export default function ListPage({
  scorer,
  queryGroup,
  query,
  queryResult,
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
            icon="ri-star-fill"
          />
        </div>
      </div>
    </>);
  }

  const getRatingsPanelFor = (doc) => {
    const rateDoc = async (value) => {
      try {
        console.log(value, doc);
        const payload = {
          doc: doc,
          score: value
        }
        const response = await resultService.register_score(queryGroup.id, queryResult.query_id, queryResult.id, payload);
      } catch (error) {
        logger.error(error);
      } finally {
        setShowRatingPaneFor(false);
      }
    };

    return (
      <div className="rounded-xl flex flex-col space-y-2 p2 bg-blue-100 p-4">
        <div>
          Rate this result
        </div>
        <div className="flex flex-row space-x-2">
          {scorer.scale.map((scaleValue) => {
            return (
              <div className="w-12 h-12 text-white flex items-center justify-center text-2xl font-extrabold"
                style={{backgroundColor: colorForScaleValue(scorer.scale.length, scaleValue)}}
                key={scaleValue}
                onClick={() => rateDoc(scaleValue)}
              >
                {scaleValue}
              </div>)
          })}
        </div>
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
              (<div className="absolute inset-y-1 right-4">{getRatingsPanelFor(doc)}</div>)
              : ''
          }
        </Card>
      ))}
    </div>
  );
}
