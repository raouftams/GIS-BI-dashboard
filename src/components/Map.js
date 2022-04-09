import { MapContainer, TileLayer, LayersControl, GeoJSON} from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import { React, useState, useEffect } from 'react'
import './map.css'


const { BaseLayer } = LayersControl

const MyData = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const url = 'http://127.0.1:8000/all-towns'
    const getData = async () => {
      const response = await axios.get(url, {
        headers: {"Access-Control-Allow-Origin": "*"}
      });
      setData(response.data)
    };

    getData();

  }, []);

  if (data) {
    return <GeoJSON data={data}/>
  } else {
    return null;
  }
};

const Maps = () => {
  return (
    <div className='map-container'>
        <MapContainer id='mapId' className='map' center={[36.7218005, 3.0988167]} zoom={11}>
            <MyData/>
            <LayersControl>
                <BaseLayer name='OSM'>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </BaseLayer>
                <BaseLayer checked name='test'>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                />
                </BaseLayer>
            </LayersControl>
        </MapContainer>
    </div>
  )
}

export default Maps