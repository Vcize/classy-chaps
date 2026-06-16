/* =============================================================
   App — composes the expedition microsite
   ============================================================= */
import { Fragment } from "react";
import { Nav, Hero, Mission, Crew } from "./sections-a.jsx";
import { FlightBoard, BaseCamp, Itinerary } from "./sections-b.jsx";
import { TrailIntel, Stats } from "./sections-c.jsx";
import { Packing, Food, Safety, Quotes, Footer } from "./sections-d.jsx";
import { ExpeditionTracker, Achievements } from "./extras.jsx";
import { GroceryList } from "./grocery.jsx";

export default function App() {
  return (
    <Fragment>
      <ExpeditionTracker />
      <Nav />
      <Hero />
      <hr className="seam" />
      <Mission />
      <Crew />
      <hr className="seam" />
      <FlightBoard />
      <hr className="seam" />
      <GroceryList />
      <hr className="seam" />
      <BaseCamp />
      <hr className="seam" />
      <Itinerary />
      <TrailIntel />
      <hr className="seam" />
      <Stats />
      <Achievements />
      <Packing />
      <hr className="seam" />
      <Food />
      <Safety />
      <hr className="seam" />
      <Quotes />
      <Footer />
    </Fragment>
  );
}
