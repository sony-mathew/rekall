import React, { useState, useEffect } from "react";
import { Button, Card, Tooltip } from "neetoui";

import { colorForScaleValue } from 'common/colorHelper';
import resultService from "apis/resultService";
import QueryGroups from "../QueryGroups";

export default function ListPage({
  scorer,
  queryGroup,
  query,
  queryResult,
  items = [],
  setCurrrentResource,
  refreshQueryResult,
  scores
}) {

  const [showRatingPaneFor, setShowRatingPaneFor] = useState(false);

  const displayUserRatingFor = (doc) => {
    if(!doc || !scores) {
      return (<Button
        onClick={() => { setCurrrentResource(doc); setShowRatingPaneFor(doc); } }
        label=""
        icon="ri-star-fill"
      />);
    }
    const document_uuid = doc[scores.document_uuid];

    if(scores.ratings[document_uuid]) {
      const userScore = scores.ratings[document_uuid].value;
      return (
      <div className="w-10 h-10 text-white flex items-center justify-center text-xl font-semibold rounded"
        style={{backgroundColor: colorForScaleValue(scorer.scale.length, userScore)}}
        onClick={() => { setCurrrentResource(doc); setShowRatingPaneFor(doc); }}
      >
        {userScore}
      </div>
      );
    } else {
      return (<Button
        onClick={() => { setCurrrentResource(doc); setShowRatingPaneFor(doc); } }
        label=""
        icon="ri-star-fill"
      />);
    }
  }

  const displayFieldsFor = (doc) => {
    let allFields = {};
    for(let i = 0; i < queryGroup['document_fields'].length; ++i) {
      const key = queryGroup['document_fields'][i];
      allFields[key] = doc[key];
    }

    return (
      <>
        <div className="flex flex-row space-x-4 text-gray-900">
          <div className="flex-1 flex flex-col">
            {Object.keys(allFields).map(field => {
              return (
                <div key={field} className="flex flex-row space-x-4 text-gray-900">
                  <div>{field}: </div>
                  <div>{allFields[field]}</div>
                </div>
              );
            })}
          </div>
          <div>
            <Tooltip content="Rate this result" position="bottom" minimal>
              {displayUserRatingFor(doc)}
            </Tooltip>
          </div>
        </div>
      </>
    );
  }

  const getRatingsPanelFor = (doc) => {
    const rateDoc = async (value) => {
      try {
        // console.log(value, doc);
        const payload = {
          doc: doc,
          score: value
        }
        const response = await resultService.register_score(queryGroup.id, queryResult.query_id, queryResult.id, payload);
        await refreshQueryResult();
      } catch (error) {
        logger.error(error);
      } finally {
        setShowRatingPaneFor(false);
      }
    };

    return (
      <div className="rounded-l flex flex-col space-y-2 p2 bg-gray-200 p-4">
        <div>
          Rate this result
        </div>
        <div className="flex flex-row space-x-2">
          {scorer.scale.map((scaleValue) => {
            return (
              <div className="w-12 h-12 text-white flex items-center justify-center text-2xl font-extrabold rounded-l"
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
          <div>{displayFieldsFor(doc)}</div>
          { (showRatingPaneFor &&  showRatingPaneFor === doc) ? 
              (<div className="absolute inset-y-1 right-4">{getRatingsPanelFor(doc)}</div>)
              : ''
          }
        </Card>
      ))}
    </div>
  );
}
