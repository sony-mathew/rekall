import React from "react";
import { Button } from "neetoui";

export default function ApiSourcesTable({
  apiSources = [],
  setCurrrentApiSource,
  showPane
}) {
  return (
    <div className="w-full px-4">
      <table className="nui-table nui-table--checkbox">
        <thead>
          <tr>
            <th> ID </th>
            <th className="text-left">Name</th>
            <th className="text-left">Host</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiSources.map(apiSource => (
            <tr
              key={apiSource.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td> {apiSource.id} </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                {apiSource.environment}  / {apiSource.name}
                </div>
              </td>
              <td>{apiSource.host}</td>
              <td>
                <Button
                  onClick={() => { setCurrrentApiSource(apiSource); showPane(true); } }
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
