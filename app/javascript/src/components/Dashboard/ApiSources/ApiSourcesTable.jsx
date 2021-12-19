import React from "react";
import { Button } from "neetoui";

export default function ApiSourcesTable({
  apiSources = [],
  setCurrrentApiSource,
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
                  {apiSource.name} <div className="ml-2 bg-indigo-600 bg-opacity-50 hover:bg-opacity-75 rounded py-1 px-2 text-white inline-flex">{apiSource.environment}</div>
                </div>
              </td>
              <td>{apiSource.host}</td>
              <td className="flex flex-row space-x-2">
                <Button
                  onClick={() => { setCurrrentApiSource(apiSource); showPane(true); } }
                  label=""
                  icon="ri-pencil-line"
                />
                <Button
                  onClick={() => { setCurrrentApiSource(apiSource); setShowDeleteAlert(true); } }
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
