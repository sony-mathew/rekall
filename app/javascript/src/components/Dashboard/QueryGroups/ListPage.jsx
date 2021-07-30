import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "neetoui";
import QueryGroups from ".";

export default function ListPage({
  items = [],
  setCurrrentResource,
  showPane
}) {
  const displayFieldsFor = (queryGroup) => {
    if(Array.isArray(queryGroup.document_fields)) {
      return queryGroup.document_fields.join(', ');
    }
    return queryGroup.document_fields;
  }

  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox">
        <thead>
          <tr>
            <th> ID </th>
            <th className="text-left">Name</th>
            <th className="text-left">Method</th>
            <th className="text-left">Document Unique Field</th>
            <th className="text-left">Document Fields</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(queryGroup => (
            <tr
              key={queryGroup.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td> {queryGroup.id} </td>
              <td>
                <NavLink
                  to={`/query_groups/${queryGroup.id}/queries`}
                  className="w-full nui-dropdown--item"
                  activeClassName="active"
                  // onClick={e => e.target.parentElement.click()}
                >
                  <div className="flex flex-row items-center justify-start text-gray-900">
                    {queryGroup.name}
                  </div>
                </NavLink>
              </td>
              <td>{queryGroup.http_method}</td>
              <td>{queryGroup.document_uuid}</td>
              <td>[{displayFieldsFor(queryGroup)}]</td>
              <td>
                <Button
                  onClick={() => { setCurrrentResource(queryGroup); showPane(true); } }
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
