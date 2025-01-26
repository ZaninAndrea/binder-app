import React from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"

export function Mobile({ children }) {
    const isMobile = useMediaQuery("(max-width:866px)")

    if (isMobile) return <>{children}</>
    else return ""
}
export function Desktop({ children }) {
    const isDesktop = useMediaQuery("(min-width:867px)")

    if (isDesktop) return <>{children}</>
    else return ""
}
