// const express = require("express");
const express = require("express"); // we use express to write our server
const mongoose = require("mongoose");
const url = "mongodb://localhost/Portal"; // mongodb connection string
const cors = require("cors"); // it share the data of frontend with backend let suppose or backend server is running on different port (8080) and or front-end port is running on different port (3000) cors will help to communicate between them.
const app = express();
const path = require("path"); // allow us to change paths
const bodyParser = require("body-parser"); // parse the body of request
const bcrypt = require("bcrypt"); // bcrypt provides securuty
const { port } = require("./config/vars");
const saltRounds = 10; // 2^10 iterations

async function generateResetPasswordSalt() {
  const secretKey = await bcrypt.genSalt(saltRounds);
  console.log("secretKey -=-=-=>", secretKey); // create string for RESET_PASSWORD
  return secretKey;
}

mongoose.connect(url, { useNewUrlParser: true });

const cons = mongoose.connection;

cons.on("open", () => {
  console.log("connected...");
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "uploads"))); // this allows us to read our static files etc..

app.get("/", (req, res) => {
  res.send("This is Server Side!");
});

//auth (login, and Signup ) routes
const authRoutes = require("./routes/user.auth.route");
app.use("/auth", authRoutes);

// routes for customers (clients) module
const client = require("./routes/cutomers.client.route");
app.use("/clients", client);
// routes for customers (clients User) module
const clientUser = require("./routes/customers.clientUser.route");
app.use("/users", clientUser);
// routes for Project (project) module
const projects = require("./routes/projects.route");
app.use("/project", projects);
// routes for Project (template) module
const templates = require("./routes/projects.template.route");
app.use("/templates", templates);
const leads = require("./routes/leads.route");
app.use("/leads", leads);
// routes for tasks module
const tasks = require("./routes/tasks.route");
app.use("/tasks", tasks);
// routes for knowledgebase module
const article = require("./routes/knowledgebase.article.route");
app.use("/article", article);
// routes for others (team Members)
// const team = require('./routes/teamMembers.route');
const team = require("./routes/teamMembers.route");
app.use("/team", team);
//rotues for sales module
const invoice = require("./routes/sales/invoices.route");
app.use("/invoice", invoice);
const payment = require("./routes/sales/payments.route");
app.use("/payment", payment);
const estimates = require("./routes/sales/estimates.route");
app.use("/estimates", estimates);
const product = require("./routes/sales/products.route");
app.use("/product", product);
const expenses = require("./routes/sales/expenses.route");
app.use("/expenses", expenses);
const proposals = require("./routes/sales/proposals.route");
app.use("/proposals", proposals);

app.listen(port, async () => {
  const secretKey = await generateResetPasswordSalt();
  console.log(`Server is listening on port ${port}`);
});
