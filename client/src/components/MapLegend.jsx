import React from "react";
import { useState, useEffect } from "react";
import ClientPopUp from "./ClientPopUp";
const MapLegend = ({ legendItems, openLegend, setOpenLegend }) => {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [clientListInRange, setClientListInRange] = useState();
  const [showClients, setShowClients] = useState(false);

  useEffect(() => {
    fetch(`/client/${min}/${max}`)
      .then((res) => res.json())
      .then((list) => {
        setClientListInRange(list);
      });
  }, [min]);

  function getClients(event) {
    let itemRange = event.target.value;

    if (itemRange === "0") {
      setMin(0);
      setMax(0);
    } else if (itemRange.includes("+")) {
      itemRange = itemRange.split(" ");
      itemRange = itemRange[0];
      itemRange = itemRange.replace(",", "");
      setMin(parseInt(itemRange));
      setMax(100000000000);
    } else {
      itemRange = itemRange.split(" - ");
      setMin(parseInt(itemRange[0].replace(",", "")));
      setMax(parseInt(itemRange[1].replace(",", "")));
    }
    setShowClients(true);
  }

  function flipMenu() {
    openLegend ? setOpenLegend(!openLegend) : setOpenLegend(openLegend);
  }

  return (
    <div
      id="map-legend-wrapper"
      style={
        openLegend
          ? {
              transform: "translateY(0)",
              display: "flex",
              alignItems: "stretch",
            }
          : {
              transform: "translateY(-100%)",
              display: "flex",
              alignItems: "stretch",
              zIndex: -1,
            }
      }
    >
      {legendItems.map((item, index) => (
        <button
          onClick={getClients}
          key={index}
          value={item.title}
          name={item.title}
          style={{
            backgroundColor: item.color,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: item.textColor,
            height: "10vh",
            fontWeight: "bolder",
            fontSize: "1.5em",
          }}
        >
          {item.title}
        </button>
      ))}
      {showClients ? (
        <ClientPopUp
          min={min}
          max={max}
          clientListInRange={clientListInRange}
          setShowClients={setShowClients}
          showClients={showClients}
        />
      ) : null}
    </div>
  );
};

export default MapLegend;
