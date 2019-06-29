import * as React from "react";


import SmartEditor from "./edit/SmartEditor";




const RORichContent = ({ content }) => {

    return content && (<div style={{ width: "500px" }}><SmartEditor readonly={true} content={content} onCardHover={onCardHover} /></div>)

}


const onCardHover = (e) => console.log("#", e)
export default RORichContent;