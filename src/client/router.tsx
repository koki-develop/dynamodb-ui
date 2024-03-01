import { createBrowserRouter } from "react-router-dom";
import TablesPage from "./components/TablesPage/TablesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <TablesPage />,
  },
]);
