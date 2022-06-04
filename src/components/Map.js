import { React, useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import { useNavigate } from "react-router-dom";
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'
import Popup from './mapComponents/Popup'
import 'leaflet/dist/leaflet.css'
import './map.css'

const Colors = ["#E74C3C", "#9B59B6", "#3498DB", "#ECF0F1", "#F1C40F", "#2ECC71"] 

const Maps = ({selected, type, isStat}) => {
  //selected is the code property of the selected layer
  //type can be 'town' or 'unity' 
  //isStat is true if we load stats page
  const navigate = useNavigate()
  const geoJsonRef = useRef()
  const [data, setData] = useState(null);
  const [importantZones, setImportantZones] = useState(null)
  const [isImportant, setIsImportant] = useState(false)
  const [cluster, setCluster] = useState(null)
  const [clusterPeriod, setClusterPeriod] = useState()
  const [isClustering, setIsClustering] = useState(false)
  const [currentSeason, setCurrentSeason] = useState()
  const [isUnity, setIsUnity] = useState(false)

  const getSelectedTown = (e) => {
    const properties = e.target.feature.properties
    navigate("/dashboard/town/".concat(properties.code))
  }

  const getSelectedUnity = (e) => {
    const properties = e.target.feature.properties
    navigate("/dashboard/unity/".concat(properties.code))
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

      if(isClustering){
        if(cluster != null){
          var currentPeriodCluster = null
          switch (clusterPeriod) {
            case 'month':
              currentPeriodCluster = cluster.month
              break;
            case 'year':
              currentPeriodCluster = cluster.year
              break;
            case 'week':
              currentPeriodCluster = cluster.week
              break;
            default:
              break;
          }
          if(currentPeriodCluster != null){
            const clusterLabel = currentPeriodCluster.labels[currentPeriodCluster.towns.indexOf(feature.properties.code)]
            layer.setStyle({
              color: Colors[clusterLabel]
            })
          }
        }
      }
      

      if(isImportant){
        if(importantZones != null){
          var important = []
          if(currentSeason === 'winter'){
            important = importantZones.winter
          }
          if(currentSeason === 'summer'){
            important = importantZones.summer
          }
          if(currentSeason === 'spring'){
            important = importantZones.spring
          }
          if(currentSeason === 'autumn'){
            important = importantZones.autumn
          }
          if(important){
            if(important.includes(feature.properties.code)){
              layer.setStyle({
                color: 'red'
              })
            }
          }
        }        
      }

      //if town is selected then set style to the polygon
      if(selected && selected.code === feature.properties.code)
        layer.setStyle({
          color: "red",
          fillColor: "red",
          fillOpacity: "0.4"
        })

      //Adding popup to the feature
      let popup = ReactDOMServer.renderToString(
        <Popup feature={feature} />
      );
      layer.bindPopup(popup);
    }

  }

  const getImportantZones = async () => {
    const response = await axios.get('http://127.0.0.1:8000/stats/waste/change-rate-by-season', {
        headers: {"Access-Control-Allow-Origin": "*"}
    })
    setImportantZones(JSON.parse(response.data))
  }

  const getClusters = async () => {
    const response = await axios.get('http://127.0.0.1:8000/all-towns/clustering', {
          headers: {"Access-Control-Allow-Origin": "*"}
      })
      setCluster(JSON.parse(response.data))
  }

  const selectClusterZones = () => {
    setIsClustering(true)
    setImportantZones(false)
    geoJsonRef.current.addData(data)
  }

  const monthCluster = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      setClusterPeriod('month')
      selectClusterZones()
    }
  }

  const yearCluster = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      setClusterPeriod('year')
      selectClusterZones()
    }
  }

  const weekCluster = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      setClusterPeriod('week')
      selectClusterZones()
    }
  }

  const selectImportantZones = (season) => {
    setIsImportant(true)
    setIsClustering(false)
    setCurrentSeason(season)
    geoJsonRef.current.addData(data)
  }

  const markWinter = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      selectImportantZones('winter')
    }
  }
  const markSummer = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      selectImportantZones('summer')
    }
  }
  const markSpring = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      selectImportantZones('spring')
    }
  }
  const markAutumn = () => {
    if(geoJsonRef){
      geoJsonRef.current.clearLayers()
      selectImportantZones('autumn')
    }
  }

  const MyData = () => {
    
    useEffect(() => {
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
      if(data == null){
        getData();
      }
      if(importantZones == null && selected == null && type == null){
        getImportantZones()
      }
      if(cluster == null && selected == null && type == null){
        getClusters()
      }
        
    }, []);

    if (data) {
      return <GeoJSON ref={geoJsonRef} data={data} onEachFeature={onEachFeature}/>
    } else {
      return null;
    }
  };

  const loadUnities = () => {
    if(geoJsonRef){
      setIsImportant(false)
      setIsClustering(false)
      geoJsonRef.current.clearLayers()
      setIsUnity(true)
      axios.get('http://127.0.0.1:8000/all-unities', {
        headers: {"Allow-Origin-Control": "*"}
      }).then((response) => {
        geoJsonRef.current.addData(response.data)
      })
      
    }
  }

  const resetData = () => {
    geoJsonRef.current.clearLayers()
    setIsUnity(false)
    setIsImportant(false)
    geoJsonRef.current.addData(data)
  }


  const MapControl = () => {
    if(!selected && !isStat){
      return (
        <div className='ml-4 h-full w-1/3 bg-dark-100 rounded shadow-lg overflow-hidden'>
          <p className='text-gray-300 font-bold text-center pt-4'>Zones importantes</p>
          <div className='flex justify-center ml-7 mt-2'>
            <div className='flex-col justify-center'>
              <button className='w-24 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={markWinter}>hiver</button>
              <button className='w-24 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={markSpring}>printemps</button>
            </div>
            <div className='flex-col justify-center'>
              <button className='w-24 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={markSummer}>été</button>
              <button className='w-24 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={markAutumn}>autumn</button>
            </div>
          </div>
          <p className='text-gray-300 font-bold text-center pt-4 mt-3'>Groupement par tandence</p>
          <div className='flex justify-between mx-2 mt-3'>
            <button className='w-20 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={yearCluster}>année</button>
            <button className='w-20 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={monthCluster}>mois</button>
            <button className='w-20 mt-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={weekCluster}>semaine</button>
          </div>
          <p className='text-gray-300 font-bold text-center pt-4 mt-4'>Données géographiques</p>
          <div className='flex justify-center mt-3'>
            <button className='w-24 mx-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={resetData}>communes</button>
            <button className='w-20 mx-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={loadUnities}>unités</button>
          </div>
        </div>
      )
    }
     
    return null
  }

  return (
    <div className='map-container h-3/6 flex justify-between rounded shadow-lg'>
        <MapContainer id='mapId' className='map' center={[36.7218005, 3.0988167]} zoom={10}>
            <MyData/>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                />
        </MapContainer>
        <MapControl/>
    </div>
  )
}

export default Maps