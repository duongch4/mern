import React from "react";

type JsonPrintProps = {
    data: any;
};

const isEmptyObj = (obj: any): boolean => (typeof obj === "undefined" || Object.keys(obj).length) === 0;

export const JsonPrint = (props: JsonPrintProps): React.ReactElement => (
    <div className="text-left">
        {
            !isEmptyObj(props.data)
            ? <pre>{JSON.stringify(props.data, undefined, 2)}</pre>
            : undefined
        }
    </div>
);
