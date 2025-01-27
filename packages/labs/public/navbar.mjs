import { toHtmlElement } from "./toHtmlElement.mjs";

let navElement = "";
let navDefault = "";

navElement = toHtmlElement(
  `<nav>
	  <h1>Kevin Beltran</h1>
	  <a href="index.html">Home</a>
	  <a href="projects.html">Projects</a>
	  <a href="hobbies.html">Hobbies</a>
	</nav>`
);

window.addEventListener("load", () => {
  // Create a function on the fly
  // Code in this function will run once the page is done loading
  navDefault = document.querySelector("nav");
  navDefault.replaceWith(navElement);

  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = navElement.querySelectorAll("a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.style.color = "darkred"; // Make the active link black
    } else {
      link.style.color = "";
    }
  });
});
