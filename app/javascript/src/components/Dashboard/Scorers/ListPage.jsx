import React from "react";
import { Button } from "neetoui";

export default function ListPage({
  items = [],
  setCurrentResource,
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
            <th className="text-left">Type</th>
            <th className="text-left">Scale</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(scorer => (
            <tr
              key={scorer.id}
              className={"cursor-pointer bg-white hover:bg-gray-50"}
            >
              <td> {scorer.id} </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  {scorer.name}
                </div>
              </td>
              <td>
                <div className={ (scorer.user_id ? 'bg-blue-600' : 'bg-indigo-600') + " ml-2 bg-opacity-50 hover:bg-opacity-75 rounded py-1 px-2 text-white inline-flex"}>
                  {scorer.user_id ? 'Custom' : 'Community'}
                </div>
              </td>
              <td>
                <div className="flex flex-row items-center justify-start text-gray-900">
                  {scorer.scale_type}
                </div>
              </td>
              <td className="flex flex-row space-x-2">
                <Button
                  onClick={() => { setCurrentResource(scorer); showPane(true); } }
                  label=""
                  icon="ri-pencil-line"
                />
                { scorer.user_id ? 
                    <Button
                      onClick={() => { setCurrentResource(scorer); setShowDeleteAlert(true); } }
                      label=""
                      icon="ri-delete-bin-7-line"
                      style="danger"
                    />
                  : ''
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
