import _ from "lodash";

export function paginate (noOfItems,pageSize,currentPage) {
    const startIndex = (currentPage - 1) * pageSize;  // indexing wise -1 and for placing or positioning the index in the items array into a cycles of 4(page size)
    return _(noOfItems).slice(startIndex).take(pageSize).value();

    
}