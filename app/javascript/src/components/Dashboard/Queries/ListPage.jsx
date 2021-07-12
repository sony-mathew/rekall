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
            <th className="text-left">Queries</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {items.map(query => (
              <tr key={query.id} className={"cursor-pointer bg-white hover:bg-gray-50"}>
                <td>
                  <NavLink
                    to={`/query_groups/${query.query_group_id}/queries/${query.id}/results`}
                    className="w-full"
                    activeClassName="active"
                    // onClick={e => e.target.parentElement.click()}
                  >
                    <div className="flex flex-row items-center justify-start text-gray-900">
                      {query.query_text} (#{query.id})
                    </div>
                  </NavLink>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
