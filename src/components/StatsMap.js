import { React, useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from "react-router-dom";
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'
import Popup from './mapComponents/Popup'
import 'leaflet/dist/leaflet.css'
import './map.css'
import Legend from './mapComponents/Legend';

const StatsMap = ({selected, type, dataName, filter}) => {
    //selected is the code property of the selected layer
    //type can be 'town' or 'unity' 
    //dataName can be wasteQte or efficiency
    //filter is an object containing year and month values
    const [map, setMap] = useState(null)
    const navigate = useNavigate()
    const geoJsonRef = useRef()
    const [currentType, setCurrentType] = useState()
    const [currentDataType, setCurrentDataType] = useState()
    const [currentYear, setCurrentYear] = useState()
    const [currentMonth, setCurrentMonth] = useState()
    const [data, setData] = useState(null);
    const [isUnity, setIsUnity] = useState(false)
    const [styleMapData, setStyleMapData] = useState(null)
    var addedLegend = false

  const getSelectedTown = (e) => {
    const properties = e.target.feature.properties
    navigate("/stats/".concat([type, dataName, filter.year, filter.month].join('/')).concat("/", properties.code))
  }

  const getSelectedUnity = (e) => {
    const properties = e.target.feature.properties
    navigate("/stats/".concat([type, dataName, filter.year, filter.month].join('/')).concat("/", properties.code))
  }

  const openPopup = (e) => {
    e.target.openPopup()
  }

  const closePopup = (e) => {
    e.target.closePopup()
  }

  const onEachFeature = (feature, layer) => {
    if(layer){
        //get the selected feature onClick
        if(isUnity){
          layer.on({
            click: getSelectedUnity,
            mouseover: openPopup,
            mouseout: closePopup
          })
        }else{
          layer.on({
            click: getSelectedTown,
            mouseover: openPopup,
            mouseout: closePopup
          })
        }

   
        //adding colors to data by value
        if(styleMapData !== null){
            const valueIndex = styleMapData.regions.indexOf(feature.properties.code)
            if (dataName === 'efficiency') {
                layer.setStyle({
                    color: mapPolygonColorToEfficiency(styleMapData.values[valueIndex]),
                    fillColor: mapPolygonColorToEfficiency(styleMapData.values[valueIndex]),
                    fillOpacity: "0.5"
                })   
            }else{
              if(dataName === 'quantity')
                layer.setStyle({
                    color: mapPolygonColorToQte(styleMapData.values[valueIndex]),
                    fillColor: mapPolygonColorToQte(styleMapData.values[valueIndex]),
                    fillOpacity: "0.5"
                })
            }
        }

        //if town is selected then set style to the polygon
        if(selected === feature.properties.code)
          layer.setStyle({
            color: "green",
            fillColor: "green",
            fillOpacity: "0.4"
        })


        //Adding popup to the feature
        let popup = ReactDOMServer.renderToString(
          <Popup feature={feature} />
        );
        layer.bindPopup(popup);
    }

  }

    const mapPolygonColorToQte=(qte => {
        if(type === 'unity')
            return qte > 11000
                ? "#800026"
                : qte > 10000
                ? "#BD0026"
                : qte > 9000
                ? "#E31A1C"
                : qte > 8000
                ? "#FC4E2A"
                : qte > 7000
                ? "#FD8D3C"
                : qte > 6000
                ? "#FEB24C"
                : qte > 5000
                ? "#FED976"
                : "#FFEDA0";
        return qte > 6000
            ? "#800026"
            : qte > 5000
            ? "#BD0026"
            : qte > 4000
            ? "#E31A1C"
            : qte > 3000
            ? "#FC4E2A"
            : qte > 2000
            ? "#FD8D3C"
            : qte > 1000
            ? "#FEB24C"
            : qte > 500
            ? "#FED976"
            : "#FFEDA0";
    })

    const mapPolygonColorToEfficiency=(value => {
        return value > 0.45
                ? "#800026"
                : value > 0.4
                ? "#BD0026"
                : value > 0.35
                ? "#E31A1C"
                : value > 0.3
                ? "#FC4E2A"
                : value > 0.25
                ? "#FD8D3C"
                : value > 0.2
                ? "#FEB24C"
                : value > 0.15
                ? "#FED976"
                : "#FFEDA0";
    })

    const MyData = () => {
    
      useEffect(() => {
        //get geographical data 
        var url = 'http://127.0.1:8000/all-towns'
        if(type === 'unity'){
          url = 'http://127.0.1:8000/all-unities'
          setIsUnity(true)
        }
        const getData = async () => {
          const response = await axios.get(url, {
            headers: {"Access-Control-Allow-Origin": "*"}
          });
          setData(response.data)
        };

        //get qte and efficiency data
        var dataUrl = `http://127.0.1:8000/all-towns/efficiency/${filter.year}/${filter.month}`
        if(dataName === 'quantity'){
          dataUrl = `http://127.0.1:8000/all-towns/waste-qte/${filter.year}/${filter.month}`
        }
        if(type === 'unity'){
          if(dataName === 'quantity'){
            dataUrl = `http://127.0.1:8000/all-unities/waste-qte/${filter.year}/${filter.month}`
          }
          if(dataName === 'efficiency'){
            dataUrl = `http://127.0.1:8000/all-unities/efficiency/${filter.year}/${filter.month}`
          }
        }

        const getStyleData = async () => {
          const response = await axios.get(dataUrl, {
            headers: {"Access-Control-Allow-Origin": "*"}
          })

          setStyleMapData(JSON.parse(response.data))
        }

        if(currentType !== type || currentDataType !== dataName || currentYear !== filter.year || currentMonth !== filter.month){
          setCurrentType(type)
          setCurrentDataType(dataName)
          setCurrentMonth(filter.month)
          setCurrentYear(filter.year)
          getData();
          getStyleData();
        }      
      });

    if (data && styleMapData) {
      return <GeoJSON ref={geoJsonRef} data={data} onEachFeature={onEachFeature}/>
    } else {
      return null;
    }
  };

    const ControlLegend = () =>{
        if(addedLegend === false && map && filter){
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
            addedLegend = true
            legend.addTo(map);
        }
        return null
    }

  return (
    <div className='map-container h-3/6 flex justify-between rounded shadow-lg'>
        <MapContainer id='mapId' className='map' center={[36.7218005, 3.0988167]} zoom={10} whenCreated={setMap}>
            <MyData/>
            <TileLayer
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            />
        </MapContainer>
    </div>
  )
}

export default StatsMap