import React, { useEffect } from "react";
import { Tooltip } from "neetoui";

import { colorForBinaryRating } from 'common/colorHelper';

export default function ListPage({
  scorer,
  queryGroup,
  query,
  items = [],
  setCurrrentResource
}) {

  let isMounted = true;
  useEffect(() => {
    return () => { isMounted = false; };
  }, []);

  const displayUserRatingFor = (snapshot) => {
    return (
      <div className="rounded flex text-white text-xl font-semibold items-center justify-center w-14 h-10"
        style={{backgroundColor: colorForBinaryRating(snapshot.latest_score || 0.0)}}
      >
        {(snapshot.latest_score || 0.0).toFixed(2)}
      </div>
    );
  }

  return (
    <div className="w-full px-4">
    <table className="nui-table nui-table--checkbox">
      <thead>
        <tr>
          <th> # </th>
          <th className="text-left">Name</th>
          <th className="text-left">Notes</th>
          <th className="text-left">Created</th>
          <th className="text-left">Score</th>
        </tr>
      </thead>
      <tbody>
        {items.map((snapshot, snapshotIndex) => (
          <tr
            key={snapshot.id}
            className={"bg-white hover:bg-gray-50"}
          >
            <td> {snapshotIndex + 1} </td>
            <td>{snapshot.name}</td>
            <td>{snapshot.notes}</td>
            <td>{snapshot.created_at}</td>
            <td className="flex flex-row space-x-2">
              { displayUserRatingFor(snapshot) }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
