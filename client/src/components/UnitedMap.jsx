import React from "react";
//this import brings in the necessary css that stitches the map tiles together
//alternative to providing style sheet link in public/index.html
import { L } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MagicMap.css";
import { MapContainer, GeoJSON } from "react-leaflet";
//data set for us state borders
import { useState, useEffect } from "react";
import RegionZoom from "./RegionZoom";

const UnitedMap = ({ region, usBorderData, states, loadUnitedMap }) => {
  const mapCenter = [37.0902, -95.7129];
  const mapZoom = 4;
  const [USMapZoom, setUSmapZoom] = useState();
  const [newUSCenter, setUSCenter] = useState();
  const [geojson, setGeojson] = useState();

  //manages style of geoJSON child component
  const geoJSONStyle = () => {
    return {
      fillColor: "white", // color of country
      weight: 0.3, //thickness of country border lines
      color: "#335171", //color of country border line
      fillOpacity: 1,
    };
  };

  useEffect(() => {
    if (region === "Northeast") {
      setUSCenter([43.2994, -74.2179]);
      setUSmapZoom(6);
    } else if (region === "South") {
      setUSCenter([34.935595, -88.094787]);
      setUSmapZoom(5.497);
    } else if (region === "Midwest") {
      setUSCenter([42.365351, -93.171769]);
      setUSmapZoom(5);
    } else if (region === "West") {
      setUSCenter([41.997017, -114.495868]);
      setUSmapZoom(4.5);
    } else if (region === "Alaska") {
      setUSCenter([64.2008, -149.4937]);
      setUSmapZoom(4);
    } else if (region === "Hawaii") {
      setUSCenter([19.8968, -157]);
      setUSmapZoom(7);
    } else {
      setUSCenter([37.0902, -95.7129]);
      setUSmapZoom(4);
    }
  }, [region]);

  //when mouse hovers over country or state
  // function highlightBorder(e) {
  //   let layer = e.target;
  //   layer.setStyle({
  //     weight: 5,
  //     color: "#666",
  //     dashArray: "",
  //     fillOpacity: 0.7,
  //   });

  // }
  //reset to default values
  // function resetHighlight(e) {
  //   geojson.resetStyle(e.target);
  // }

  //first argument is the feature for GeoJSON we are dealing with
  //second is the layer (what's drawn on screen)
  function onEachState(countryBorder, layer) {
    // layer.on({
    //   mouseover: highlightBorder,
    //   mouseout: resetHighlight,
    // });

    //fill color on geojson layer
    layer.options.fillColor = countryBorder.properties.color;
    const usStateName = countryBorder.properties.name;

    //will show total sales of each country when country is clicked
    const totalSales = countryBorder.properties.totalSales;

    //info on popup when country is clicked
    layer.bindPopup(`${usStateName} Total Sales:
       $${Math.round(totalSales)} `);
  }

  //----------function that changes style of map based on total sales----------/
  //GeoJSON layer will rely on the country object.totalsales
  //fill color will change based on the total sales number

  return (
    <>
      <div id="map-wrapper">
        <MapContainer
          center={mapCenter}
          scrollWheelZoom={false}
          zoom={mapZoom}
          id = "map-container"
        >
          {/*This GeoJson is overlaying polygons onto the tilelayer => polygons are the borders of US States */}
          <GeoJSON
            data={states}
            onEachFeature={onEachState}
            style={geoJSONStyle}
          />
          {newUSCenter && USMapZoom ? (
            <RegionZoom center={newUSCenter} zoom={USMapZoom} />
          ) : null}
        </MapContainer>
      </div>
    </>
  );
};

export default UnitedMap;
