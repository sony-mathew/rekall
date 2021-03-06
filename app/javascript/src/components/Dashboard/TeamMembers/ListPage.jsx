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
            <th className="text-left"> Name </th>
            <th className="text-left"> Email </th>
            <th className="text-left"> Role </th>
            <th className="text-left"> Updated At </th>
            <th className="text-left"> Actions</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {items.map(teamMember => (
              <tr key={teamMember.id} className={"cursor-pointer bg-white hover:bg-gray-50"}>
                <td>{teamMember.id}</td>
                <td>{teamMember.member.first_name} {teamMember.member.last_name}</td>
                <td>{teamMember.member.email}</td>
                <td>{teamMember.role}</td>
                <td>
                  <div className="text-xs text-gray-400">
                    {timeSince(new Date(teamMember.updated_at))} ago
                  </div>
                </td>
                <td className="flex flex-row space-x-2">
                  <Button
                    onClick={() => { setCurrrentResource(teamMember); showPane(true); } }
                    label=""
                    icon="ri-pencil-line"
                  />
                  <Button
                    onClick={() => { setCurrrentResource(teamMember); setShowDeleteAlert(true); } }
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
