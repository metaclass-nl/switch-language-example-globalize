
import App from "./App.js";
var app = new App();

app.render();

// Display demo.
document.getElementById( "requirements" ).style.display = "none";
document.getElementById( "demo" ).style.display = "block";

app.componentDidMount();
