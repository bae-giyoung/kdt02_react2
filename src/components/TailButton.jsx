export default function TailButton({caption, color, onHandle}) {

    const bg = {
        "blue" : "bg-blue-800",
        "orange" : "bg-orange-800",
        "lime" : "bg-lime-800",
    }
    return (
        <button 
                onClick={onHandle}
                className={`bg-amber-950 ${bg[color]} text-white px-4 
                                        font-extrabold text-ml h-10 rounded-lg
                                        hover:bg-blue-950 cursor-pointer`}>
            {caption}
        </button>
    )
}