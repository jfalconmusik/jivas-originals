import React, { useContext } from "react"
import ImageComponent from "./imageComponent"
import { Context } from "./Context.js"
// import { getClass } from "../utils"


function Shop() {
    const { allPhotos } = useContext(Context)

    const imageElements = allPhotos.map((img) => (
        <ImageComponent key={img.id} img={img} className="imageComponent" />
    ))

    return (
        <div>
            <main className="photos">
                {imageElements}
            </main>
        </div>
    )
}

export default Shop