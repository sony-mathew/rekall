import React from "react";
import { Button } from "neetoui";
import { timeSince } from "common/timeHelper";

export default function ListPage({
  items = [],
  team,
  setCurrrentResource,
  showPane,
  currentResource,
  setShowDeleteAlert
}) {
  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox">
        <thead>
          <tr>
            <th className="text-left"> ID </th>
            <th className="text-left"> Resource Type </th>
            <th className="text-left"> Name </th>
            <th className="text-left"> Updated At </th>
            <th className="text-left"> Actions</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {items.map(teamResource => (
              <tr key={teamResource.id} className={"cursor-pointer bg-white hover:bg-gray-50"}>
                <td>{teamResource.id}</td>
                <td>{teamResource.resourceable_type}</td>
                <td>{teamResource.resourceable.name}</td>
                <td>
                  <div className="text-xs text-gray-400">
                    {timeSince(new Date(teamResource.updated_at))} ago
                  </div>
                </td>
                <td className="flex flex-row space-x-2">
                  {/* <Button
                    onClick={() => { setCurrrentResource(teamResource); showPane(true); } }
                    label=""
                    icon="ri-pencil-line"
                  /> */}
                  <Button
                    onClick={() => { setCurrrentResource(teamResource); setShowDeleteAlert(true); } }
                    label=""
                    icon="ri-delete-bin-7-line"
                    style="danger"
                  />
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
