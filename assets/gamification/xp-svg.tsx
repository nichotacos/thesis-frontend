import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface XPSVGProps {
    width?: number
    height?: number
    style?: object
    props?: any
}

const XPSVG = ({
    width,
    height,
    style,
    ...props
}: XPSVGProps) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 512 512"
        style={style || {}}
        {...props}
    >
        <Path
            fill="#FFB636"
            d="m459.866 218.346-186.7.701c-4.619.017-7.618-4.861-5.517-8.975L370.845 8.024c3.103-6.075-4.493-11.949-9.592-7.417L39.948 286.141c-4.221 3.751-1.602 10.732 4.045 10.78l170.444 1.457c4.443.038 7.391 4.619 5.583 8.679L133.317 501.73c-2.688 6.035 4.709 11.501 9.689 7.16l320.937-279.725c4.307-3.753 1.637-10.84-4.077-10.819z"
        />
    </Svg>
)
export default XPSVG
