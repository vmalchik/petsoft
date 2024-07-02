// Pet
export const NEW_PET_TEMP_ID_PREFIX = "tmp";
export const PLACE_HOLDER_IMAGE_URL = "/placeholder.svg";

// Routes
const PRIVATE_ROUTE_PREFIX = "/app";

export enum Routes {
  // public
  Home = "/",
  Login = "/login",
  Signup = "/signup",
  Payment = "/payment",

  // protected
  App = PRIVATE_ROUTE_PREFIX,
  Account = `${PRIVATE_ROUTE_PREFIX}/account`,
  Dashboard = `${PRIVATE_ROUTE_PREFIX}/dashboard`,
}
