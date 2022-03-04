import React from "react";
import TableBody from "./tableBodyComponent";
import TableHeader from "./tableHeaderComponent";

// 1.data
// 2.columns
// 3. sortColumn  this will have sorting related data
// 4. onSort      this is custom event having the reference of eventhandler

const Table = ({ data, columns, sortColumn, onSort }) => {
  return (
    <table className="table table-hover table-light ">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />

      <TableBody data={data} columns={columns} />
    </table>
  );
};

export default Table;
