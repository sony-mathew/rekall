import React from "react";
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
            <th className="text-left">Method / Document Fields</th>
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
                <div className="flex flex-row items-center justify-start text-gray-900">
                  {queryGroup.name}
                </div>
              </td>
              <td>{queryGroup.http_method} | {queryGroup.document_fields}</td>
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
