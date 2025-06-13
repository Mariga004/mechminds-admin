import React from "react";

export default function Authlayout({
    children
}:{
    children: React.ReactNode
})  {
    return (
        <div className="flex items text-center justify-center h-full">
            {children}
        </div>
    )
}