import L from "leaflet";
import { useEffect, useState } from "react";

const Legend = ({map, type}) =>{

    const[finished, setFinished] = useState(false)
    
    useEffect(() => {
        // get color depending on population density value
        const getColor = d => {
            if(type === 'unity'){
                return d > 11000
                    ? "#800026"
                    : d > 10000
                    ? "#BD0026"
                    : d > 9000
                    ? "#E31A1C"
                    : d > 8000
                    ? "#FC4E2A"
                    : d > 7000
                    ? "#FD8D3C"
                    : d > 6000
                    ? "#FEB24C"
                    : d > 5000
                    ? "#FED976"
                    : "#FFEDA0";
            }
            return d > 6000
                ? "#800026"
                : d > 5000
                ? "#BD0026"
                : d > 4000
                ? "#E31A1C"
                : d > 3000
                ? "#FC4E2A"
                : d > 2000
                ? "#FD8D3C"
                : d > 1000
                ? "#FEB24C"
                : d > 500
                ? "#FED976"
                : "#FFEDA0";
        };
        const legend = L.control({ position: "topright" });
        
        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            let grades = [0, 500, 1000, 2000, 3000, 4000, 5000, 6000];
            if(type === 'unity'){
              grades = [0, 5000, 6000, 7000, 8000, 9000, 10000, 11000];
            }
            let labels = [];
            let from;
            let to;
          
            for (let i = 0; i < grades.length; i++) {
              from = grades[i];
              to = grades[i + 1];
            
              labels.push(
                '<i className="text-white" style="background:' +
                  getColor(from + 1) +
                  '"></i> ' +
                  from +
                  (to ? "&ndash;" + to : "+")
              );
            }
          
            div.innerHTML = labels.join("<br>");
            return div;
        };
        if(map && !finished){
            legend.addTo(map);
            setFinished(true)
        }
    }, [map, type, finished])
    return null
}

export default Legend;
