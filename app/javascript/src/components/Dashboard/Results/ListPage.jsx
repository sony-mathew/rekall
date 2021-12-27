import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "neetoui";

import { colorForScaleValue } from 'common/colorHelper';
import { isValidUrl } from 'common/urlHelper';
import resultService from "apis/resultService";

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

  let isMounted = true;
  useEffect(() => {
    return () => { isMounted = false; };
  }, []);   

  const [showRatingPaneFor, setShowRatingPaneFor] = useState(false);

  const displayUserRatingFor = (doc) => {
    if(!doc || !scores) {
      return (<Button
        onClick={() => { if(!isMounted) return; setShowRatingPaneFor(doc); } }
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
        onClick={() => { if(!isMounted) return; setShowRatingPaneFor(doc); }}
      >
        {userScore}
      </div>
      );
    } else {
      return (<Button
        onClick={() => { if(!isMounted) return; setShowRatingPaneFor(doc); } }
        label=""
        icon="ri-star-fill"
      />);
    }
  }

  const formatResultFieldDisplay = (field, fieldValue) => {
    let formattedValue = fieldValue;

    if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
      formattedValue = `No ${field}`;
    } else if (isValidUrl(fieldValue)) {
      formattedValue = (<a href={fieldValue} target="_blank">{fieldValue}</a>);
    }

    return (<Tooltip content={field} position="bottom" minimal>
      <div className={ fieldValue ? '' : 'text-gray-200' }>
        { formattedValue }
      </div>
    </Tooltip>);
  }

  const displayFieldsFor = (doc, docIndex) => {
    let allFields = {};
    for(let i = 0; i < queryGroup['document_fields'].length; ++i) {
      const key = queryGroup['document_fields'][i];
      allFields[key] = doc[key];
    }

    return (
      <>
        <div className="flex flex-row space-x-2 text-gray-500">
          <div className="align-middle text-gray-200 text-xl">
            #{docIndex + 1}
          </div>
          <div className="flex-1 flex flex-col">
            {Object.keys(allFields).map((field, fieldIndex) => {
              return (
                <div className="grid grid-flow-col auto-cols-auto" key={fieldIndex}>
                  <div key={field} className={`flex flex-row space-x-4 text-gray-600 pb-4 ${ fieldIndex === 0 ? 'text-xl' : ''}`}>
                    { formatResultFieldDisplay(field, allFields[field]) }
                  </div>
                    { fieldIndex === 0 ? (
                        <div className="auto-cols-max">
                          <div className="text-xs pb-4 pt-2 text-right text-gray-200"> {doc[queryGroup['document_uuid']]} </div>
                        </div>
                    ) : null }
                </div>
              );
            })}
          </div>
          <div className="align-middle">
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
        await resultService.register_score(queryGroup.id, queryResult.query_id, queryResult.id, payload);
        refreshQueryResult();
      } catch (error) {
        logger.error(error);
      } finally {
        if(!isMounted) return;
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
    <div className="w-full flex flex-col space-y-2">
      {items.map((doc, docIndex) => (
        <div key={doc[queryGroup['document_uuid']]} className="p-5 bg-white relative border border-t-0 border-r-0 border-l-0">
          <div className="text-gray-500 font-medium">
            <div>{displayFieldsFor(doc, docIndex)}</div>
            { (showRatingPaneFor &&  showRatingPaneFor === doc) ? 
              (<div className="absolute inset-y-1 right-4">{getRatingsPanelFor(doc)}</div>)
              : ''
            }
          </div>
        </div>
      ))}
    </div>
  );
}
