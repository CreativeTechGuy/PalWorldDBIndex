type DataTableSkeleton<Key extends string, Value, PartialRecords> = {
    Rows: PartialRecords extends true ? Partial<Record<Key, Value>> : Record<Key, Value>;
}[];

export function convertDataTableType<Key extends string, Value, PartialRecords extends boolean = false>(
    dataTable: DataTableSkeleton<Key, Value, false>,
    _options?: { partialData?: PartialRecords }
): DataTableSkeleton<string, Value, PartialRecords>[0]["Rows"] {
    return dataTable[0].Rows;
}
