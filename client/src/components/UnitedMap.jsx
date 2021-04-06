import React from "react";
//this import brings in the necessary css that stitches the map tiles together
//alternative to providing style sheet link in public/index.html
import "leaflet/dist/leaflet.css";
import "./MagicMap.css";
// import LoadBorderTask from "../mapTasks/LoadBorderTask.js";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  GeoJSON,
} from "react-leaflet";
import MapBurger from "./MapBurger.jsx";
//data set for global country borders
import { features } from "../borderData/countries.json";
//data set for us state borders
// import { features } from "../borderData/usBorder.json";
import { useState, useEffect } from "react";
import RegionZoom from "./RegionZoom";

const UnitedMap = (props) => {
  const [worldMapCenter, setWorldMapCenter] = useState([39, -29]);
  const [mapCenter, setMapCenter] = useState(worldMapCenter);
  const [mapZoom, setMapZoom] = useState(1.5);

  // const [newWorldCenter, setWorldMapCenter] = useState();

  //state for json country border data
  // const [openLegend, setOpenLegend] = useState(false);
  const [usCenter, setUSCenter] = useState([38.0, -97.0]);
  const [officialSales, setOfficialSales] = useState();

  // countryBorder.properties.color
  //manages style of geoJSON child component
  const geoJSONStyle = () => {
    return {
      fillColor: "white", // color of country
      weight: 1.2, //thickness of country border lines
      color: "blue", //color of country border line
      fillOpacity: 1,
    };
  };

  //when region is changed, send a new center and zoom into the map view

  //first argument is the feature for GeoJSON we are dealing with
  //second is the layer => thing drawn on screen
  function onEachState(countryBorder, layer) {
    if (props.region === "United States") {
      // console.log("Inside of feature function");
      // console.log(countryBorder.properties);
      //fill color on geojson layer
      layer.options.fillColor = countryBorder.properties.color;
      const usStateName = countryBorder.properties.name;

      // console.log(countryName);
      //will show total sales of each country when country is clicked
      // console.log("total sales number");
      // console.log(countryBorder.properties.totalSales);
      const totalSales = countryBorder.properties.totalSales;

      //info on popup when country is clicked
      layer.bindPopup(`${usStateName} Total Sales:
       $${Math.round(totalSales)} `);
    }
  }
  function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });
  }

  //----------function that changes style of map based on total sales----------//
  //steps
  //GeoJSON layer will rely on the country object.totalsales
  //fill color will change based on the total sales number

  return (
    <>
      <div id="map-wrapper">
        <MapContainer
          center={mapCenter}
          scrollWheelZoom={false}
          zoom={mapZoom}
          style={{ height: "64vh", width: "60vw" }}
        >
          {/*This GeoJson is overlaying polygons onto the tilelayer => polygons are the borders of US States */}
          <GeoJSON
            data={props.interUS}
            onEachFeature={onEachState}
            style={geoJSONStyle}
          />
          {/* {newWorldCenter && newWorldZoom ? (
            <RegionZoom center={newWorldCenter} zoom={newWorldZoom} />
          ) : null} */}
        </MapContainer>
      </div>
    </>
  );
};

export default UnitedMap;