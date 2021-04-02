import "./style/App.css";
import MapToggle from "./components/MapToggle";
import { useState } from "react";
import TotalSales from "./components/TotalSales";
import Countries from "./components/tasks/Countries";
import TopDash from "./components/TopDash";
import RightDash from "./components/RightDash";

function App() {
  //set the start date
  const [startDate, setStartDate] = useState(
    new Date("2011-01-01T00:00:00.000Z")
  );
  //set the end date
  const [endDate, setEndDate] = useState(new Date());
  //set the region that the map should focus on
  const [region, setRegion] = useState("World");
  //set the client that we would like to show data for:
  const [account, setAccount] = useState("all-accounts");
  //set the item we would liek to show data for:
  const [item, setItem] = useState("all-items");

  return (
    <div id="app-wrapper">
      {/* <div id="map-toggle-wrapper">
        <MapToggle
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setRegion={setRegion}
          account={account}
          setAccount={setAccount}
          setItem={setItem}
        />
      </div>
      <div id="map-wrapper">
        <TotalSales
          startDate={startDate}
          endDate={endDate}
          region={region}
          account={account}
          item={item}
        />
      </div>
      <div id="data-displays-wrapper">
        <DataDisplays />
      </div>
      {/* element to test the fetch  */}
      {/* <Countries /> */}
      <TopDash />
      <RightDash />
    </div>
  );
}

export default App;
