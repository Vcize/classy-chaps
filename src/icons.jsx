/* =============================================================
   Lucide icon wrapper — same string-name API as the prototype,
   but tree-shaken via lucide-react instead of the CDN bundle.
   ============================================================= */
import {
  Activity, ArrowRight, Backpack, Bath, BedDouble, Beer, Cake, CalendarDays,
  Camera, Car, Check, CircleCheck, CircleDot, Clock, Cookie, ExternalLink, Flame,
  Footprints, Home, Image, KeyRound, LayoutGrid, LogIn, LogOut, Map, MapPin,
  Menu, Mountain, MountainSnow, PackageCheck, PawPrint, Plane, PlaneLanding,
  PlaneTakeoff, Plus, Quote, RotateCcw, Route, Ruler, ShieldCheck, ShoppingCart,
  Signpost, Siren, Snowflake, Sparkles, SquareCheck, TentTree, Ticket, Trees,
  TrendingUp, UserRound, Users, Utensils, Video, Waves, X,
} from "lucide-react";

const REGISTRY = {
  "activity": Activity,
  "arrow-right": ArrowRight,
  "backpack": Backpack,
  "bath": Bath,
  "bed-double": BedDouble,
  "beer": Beer,
  "cake": Cake,
  "calendar-days": CalendarDays,
  "camera": Camera,
  "car": Car,
  "check": Check,
  "circle-check": CircleCheck,
  "circle-dot": CircleDot,
  "clock": Clock,
  "cookie": Cookie,
  "external-link": ExternalLink,
  "flame": Flame,
  "footprints": Footprints,
  "home": Home,
  "image": Image,
  "key-round": KeyRound,
  "layout-grid": LayoutGrid,
  "log-in": LogIn,
  "log-out": LogOut,
  "map": Map,
  "map-pin": MapPin,
  "menu": Menu,
  "mountain": Mountain,
  "mountain-snow": MountainSnow,
  "package-check": PackageCheck,
  "paw-print": PawPrint,
  "plane": Plane,
  "plane-landing": PlaneLanding,
  "plane-takeoff": PlaneTakeoff,
  "plus": Plus,
  "quote": Quote,
  "rotate-ccw": RotateCcw,
  "route": Route,
  "ruler": Ruler,
  "shield-check": ShieldCheck,
  "shopping-cart": ShoppingCart,
  "signpost": Signpost,
  "siren": Siren,
  "snowflake": Snowflake,
  "sparkles": Sparkles,
  "square-check": SquareCheck,
  "tent-tree": TentTree,
  "ticket": Ticket,
  "trees": Trees,
  "trending-up": TrendingUp,
  "user-round": UserRound,
  "users": Users,
  "utensils": Utensils,
  "video": Video,
  "waves": Waves,
  "x": X,
};

export function Icon({ name, size = 20, stroke = 2, className = "", style = {} }) {
  const Glyph = REGISTRY[name];
  if (!Glyph && import.meta.env.DEV) console.warn(`Icon "${name}" is not registered`);
  return (
    <span className={className} style={{ display: "inline-flex", lineHeight: 0, ...style }}>
      {Glyph ? <Glyph size={size} strokeWidth={stroke} /> : null}
    </span>
  );
}
