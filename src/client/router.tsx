import Layout from "@/client/components/Layout";
import TablePage from "@/client/components/pages/TablePage";
import TablesPage from "@/client/components/pages/TablesPage/TablesPage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <TablesPage /> },
      { path: "table/:name", element: <TablePage /> },
    ],
  },
]);
