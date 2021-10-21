import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "neetoui";

export default function ListPage({
  items = [],
  setCurrrentResource,
  showPane,
  setShowDeleteAlert
}) {

  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox">
        <thead>
          <tr>
            <th> ID </th>
            <th className="text-left">Name</th>
            <th className="text-left">Description</th>
            <th className="text-left">Members</th>
            <th className="text-left">Resources</th>
            <th className="text-left">Owner</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(team => (
            <tr
              key={team.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td> {team.id} </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  {team.name}
                </div>
              </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  {team.description}
                </div>
              </td>
              <td>
                <NavLink
                  to={`/teams/${team.id}/members`}
                  className="w-full nui-dropdown--item"
                  activeClassName="active"
                >
                  <div className="flex flex-row items-center justify-start text-gray-900">
                    View Members
                  </div>
                </NavLink>
              </td>
              <td>
                <NavLink
                  to={`/teams/${team.id}/resources`}
                  className="w-full nui-dropdown--item"
                  activeClassName="active"
                >
                  <div className="flex flex-row items-center justify-start text-gray-900">
                    View Resources
                  </div>
                </NavLink>
              </td>
              <td></td>
              <td className="flex flex-row space-x-2">
                <Button
                  onClick={() => { setCurrrentResource(team); showPane(true); } }
                  label=""
                  icon="ri-pencil-line"
                />
                <Button
                  onClick={() => { setCurrrentResource(team); setShowDeleteAlert(true); } }
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
