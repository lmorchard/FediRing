import { html, unescaped } from "../lib/html.js";
import layoutPage from "./layoutPage.js";
import moment from "moment";

export default ({ site = {}, page = {}, profile = {} }) =>
  layoutPage(
    {
      site,
      page,
      head: html``,
    },
    html``
  );
