import React from "react";
import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
//world map component
import WorldMap from "./WorldMap.jsx";
//united states map component
import UnitedMap from "./UnitedMap.jsx";
//map legend
import MapLegend from "./MapLegend.jsx";
//array of geoJson for world country border lines
import { features } from "../borderData/countries.json";
//component that renders while map data is loading
import Loading from "./Loading.jsx";
//array of class instances for building each rectangle in the color legend range
import legendItems from "../entities/LegendItems";

//props de-structured
const HomePage = ({
  getUSMapData,
  setGetUSMapData,
  getWorldMapData,
  setGetWorldMapData,
  region,
  usBorderData,
}) => {
  //------STATE------//
  //list of countries
  const [countries, setCountries] = useState([]);
  //total sales
  const [totalSales, setTotalSales] = useState();
  const [totalUSSales, setTotalUSSales] = useState();

  const [loadUnitedMap, setLoadUnitedMap] = useState(false);
  //reverse the array so that it's in descending order
  const legendItemsInReverse = [...legendItems].reverse();
  //use to trigger the loadMap() function
  const [loadMap, setLoadMap] = useState(false);
  const [states, setStates] = useState([]);
  //------------------//
  // fetch array of objects from db - first on a default value - then based on filter tool being used
  useEffect(() => {
    //world map
    if (getWorldMapData) {
      let interArray = [];
      fetch(`/show-sales`)
        .then((res) => res.json())
        .then((list) => {
          //push each sales item into the intermediate array
          list.forEach((countrySale) => {
            interArray.push(countrySale);
          });
          //set totalSales to be the inner array
          setTotalSales(interArray);
          //trigger the loadMap() function
          setLoadMap(true);
          setGetWorldMapData(false);
        });
    }
    //united states map
    if (getUSMapData) {
      let interStateArray = [];
      fetch(`/show-us`)
        .then((res) => res.json())
        .then((list) => {
          //push each sales item into the intermediate array
          list.forEach((countrySale) => {
            interStateArray.push(countrySale);
          });
          //set totalSales to be the inner array
          setTotalUSSales(interStateArray);
          //trigger the loadMap() function
          setLoadUnitedMap(true);
          setGetUSMapData(false);
        });
    }
  });

  //function assigns color to each country or U.S. state based on what sales range it fits into
  function setCountryColor(country) {
    const legendItem = legendItems.find((legendItem) =>
      legendItem.isFor(country.properties.totalSales)
    );

    if (legendItem != null) {
      country.properties.color = legendItem.color;
    }
  }

  //main function for united states that gets called to generate a new map based on sales filter
  //two for loops
  function loadUnitedData() {
    let BorderData = usBorderData;
    for (let usState of BorderData) {
      let usMatchedValue;
      if (totalUSSales) {
        //second for-loop to iterate through total sales list from db and match admagic US states to geoJSON
        for (let sale of totalUSSales) {
          if (usState.properties.name === sale._id) {
            //if there is a match assign it to intermediate variable
            usMatchedValue = sale;
          }
        }
      }
      //DEFAULT VALUES:
      //geoJSON layer properties total sales
      usState.properties.totalSales = 0;
      //modal text
      usState.properties.totalSalesText = "0";
      //checks if the matched total sales object has valid state
      if (usMatchedValue != null) {
        //once object enters this conditional the total sales will be isolated and assigned to correct geoJSON country
        //creates intermediate variable
        const assignUSTotalSales = usMatchedValue.totalSales;
        //assigns correct total sales to geoJSON object
        usState.properties.totalSales = assignUSTotalSales;
        //assigns total sales to geoJSON object for displaying text on pop up modal
        usState.properties.totalSalesText = assignUSTotalSales;
      }
      setCountryColor(usState);
      // assign finally the geoJSON layer to setCountries that was originally passed when useEffect called the load function
    }
    setStates(BorderData);
  }

  function loadMapData() {
    let mapCountries = features.map((country) => {
      let matchedValue;

      if (totalSales) {
        for (let sale of totalSales) {
          if (country.properties.ADMIN === sale._id) {
            matchedValue = sale;
          }
        }
      }
      country.properties.totalSales = 0;
      country.properties.totalSalesText = "0";

      if (matchedValue != null) {
        const assignTotalSales = matchedValue.totalSales;
        country.properties.totalSales = assignTotalSales;
        country.properties.totalSalesText = assignTotalSales;
      }
      setCountryColor(country);
      return country;
    });
    setCountries(mapCountries);
  }

  if (loadMap) {
    loadMapData();
    setLoadMap(false);
  }
  if (loadUnitedMap) {
    loadUnitedData();
    setLoadUnitedMap(false);
  }

  const { innerWidth: width} = window;

  return (
    <div>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) =>
            countries.length === 0 ? (
              <Loading />
            ) : (
              <div id="map-component-wrapper">
                <div>
                  <WorldMap
                    region={region}
                    countries={countries}
                    loadMap={loadMap}
                  />
                </div>
                {width > 600 ? 
                (<div>
                  <MapLegend legendItems={legendItemsInReverse} />
                </div>) : null 
          }
              </div>
            )
          }
        />
        <Route
          exact
          path="/united"
          render={(props) =>
            states.length === 0 ? (
              <Loading />
            ) : (
              <div id="map-component-wrapper">
                <div>
                  <UnitedMap
                    region={region}
                    states={states}
                    loadUnitedMap={loadUnitedMap}
                  />
                </div>
                {width > 600 ? 
                (<div>
                  <MapLegend legendItems={legendItemsInReverse} />
                </div>) : null 
          }
              </div>
            )
          }
        />
      </Switch>
    </div>
  );
};

export default HomePage;
