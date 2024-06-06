import "./cardImageAnalysis.css"


// ------------  Cards -------------------

function CardImageAnalysisAll({ id, text, Confidence}){
    return(
        <div className="descriptionCardAll">
            <p>{id}</p>
            <p>{text}</p>
            <p>{Confidence}</p>
        </div>
    )
}

function CardImageAnalysis({ text, Confidence }){
    let className = Confidence >= 1 ? "idStyle" : "descStyle"
    let className2 = text >= 1 ? "idStyle" : "descStyle"
    return(
        <div className="descriptionCard">
            <p className={className2}>{text}</p>
            <p className={className}>{Confidence}</p>
        </div>
    )
}



// -------------description

export function DescriptionMapping({ dataList }){
    return(
        dataList.map(({id, text, Confidence }) => (
            <CardImageAnalysis
            key = {id}
            text = {text}
            Confidence = {Confidence}
            />
            ) )
        )
}




export function DescriptionAllMapping({ dataList }){
    return(
        dataList.map(({id, text, Confidence}) => (
            <CardImageAnalysisAll
            key = {id}
            text = {text}
            id = {id}
            Confidence = {Confidence}
            // location = {boundingBox}
            />
            ) )
        )
}

// ----------------- read

export function ReadMapping({ dataList }){
    return(
        dataList.map(({id, Line }) => (
            <CardImageAnalysis
            key = {id}
            text = {Line}
            Confidence = {id}
            />
            ) )
        )
}

// ---------- Objects -------------


export function ObjectsMapping({ dataList }){
    return(
        dataList.map(({id, tag, Confidence  }) => (
            <CardImageAnalysis
            key = {id}
            text = {tag}
            Confidence = {Confidence}
            />
            ) )
        )
}

export function ObjectAllMapping({ dataList }){
    return(
        dataList.map(({id, text, Confidence}) => (
            <CardImageAnalysisAll
            key = {id}
            text = {text}
            id = {id}
            Confidence = {Confidence}
            />
            ) )
        )
}


// --- people

export function PeopleMapping({ dataList }){
    return(
        dataList.map(({ id, Confidence }) => (
            <CardImageAnalysis
            key = {id}
            Confidence = {Confidence}
            text = {id}
            />
            ) )
        )
}

