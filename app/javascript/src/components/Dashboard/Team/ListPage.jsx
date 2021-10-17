import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "neetoui";

export default function ListPage({
  items = [],
  setCurrrentResource,
  showPane
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
              <td>
                <Button
                  onClick={() => { setCurrrentResource(team); showPane(true); } }
                  label=""
                  icon="ri-pencil-line"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
