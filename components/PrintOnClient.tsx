"use client";

import React from "react";
type Props = {
    toPrint: unknown;
};
const PrintOnClient = (props: Props) => {
    console.log(props.toPrint);
    return <></>;
};

export default PrintOnClient;
