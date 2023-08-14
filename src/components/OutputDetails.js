import React from "react";

const OutputDetails = ({ outputDetails }) => {
    return (
        <div className="container m-4 flex flex-col space-y-4">
            <p className="text-sm">
                Status:&nbsp;
                <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
                    {outputDetails?.status?.description}
                </span>
            </p>
            <p className="text-sm">
                Memory:&nbsp;
                <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
                    {outputDetails?.memory}
                </span>
            </p>
            <p className="text-sm">
                Time:&nbsp;
                <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
                    {outputDetails?.time}s
                </span>
            </p>
        </div>
    );
};

export default OutputDetails;
