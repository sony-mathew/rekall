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
            <th className="text-left">Queries</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(query => (
            <tr
              key={query.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td> {query.id} </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  {query.query_text}
                </div>
              </td>
              <td>
                <Button
                  onClick={() => { setCurrrentResource(query); showPane(true); } }
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
