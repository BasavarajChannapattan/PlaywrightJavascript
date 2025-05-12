import { jsonServer } from "json-server";
import { auth } from "json-server-auth";
const app = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
app.db = router.db;

app.use(middlewares);
app.use(auth); // << enables /register, /login, token-based access
app.use(router);

app.listen(3000, () => {
  console.log("JSON Server running on http://localhost:3000");
});
