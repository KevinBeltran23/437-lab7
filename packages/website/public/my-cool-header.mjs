import { attachShadow, toHtml } from "./utils.mjs";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <link rel="stylesheet" href="tokens.css">
  <style>
    /* Same styles as before for the header and other elements */
    header {
      display: flex;
      padding: 0.625rem 1.25rem 1.25rem 1.25rem;
      background-color: var(--color-container-background);
      box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.2);
    }

    nav {
      background-color: var(--color-nested-container-background);
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 2rem;
      justify-content: space-between;
    }

    .name-and-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      justify-content: flex-start;
    }

    .links {
      display: flex;
      flex-direction: column;
      align-items: baseline;
      gap: 2rem;
      padding-left: 1.25rem;
      margin-bottom: 1.25rem;
      display: none; /* Initially hidden */
    }

    h1 {
      font-size: 2.25rem;
      padding: 1.25rem 0.625rem 0.625rem 0.625rem;
    }

    a {
      color: var(--color-link);
      font-size: 1.25rem;
    }

    button {
      background-color: var(--color-accent);
      margin: 1.25rem;
      border: none;
      color: var(--color-background);
      cursor: pointer;
    }

    label {
      display: flex;
      align-items: center;
      margin-left: 1rem;
      cursor: pointer;
    }

    /* Media query for desktop version */
    @media (min-width: 768px) {
      .links {
        flex-direction: row;
        margin-bottom: 0rem;
        margin-top: 0.625rem;
        display: flex; 
      }
      
      .name-and-links {
        flex-direction: row;
      }

      nav {
        justify-content: flex-start;
      }

      button {
        display: none; 
      }
    }
  </style>

  <header>
    <nav>
      <div class="name-and-links"> 
        <h1>Kevin Beltran</h1>
        <div class="links">
          <a href="index.html">Home</a>
          <a href="projects.html">Projects</a>
          <a href="hobbies.html">Hobbies</a>
        </div>
      </div>
      <label>
        <input type="checkbox" autocomplete="off" />
        Dark mode
      </label>
      <button>Menu</button>
    </nav>
  </header>
`;

class MyCoolHeader extends HTMLElement {
  connectedCallback() {
    const shadowRoot = attachShadow(this, TEMPLATE);
    const button = shadowRoot.querySelector("button");
    const links = shadowRoot.querySelector(".links");
    const checkbox = shadowRoot.querySelector('input[type="checkbox"]');

    const navLinks = shadowRoot.querySelectorAll("a");
    const currentPath = window.location.pathname.split("/").pop();

    // style current address link
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active"); // Add the "active" class
      } else {
        link.classList.remove("active"); // Remove the "active" class
      }
    });

    // toggle links visibility
    button.addEventListener("click", () => {
      links.style.display =
        links.style.display === "none" || links.style.display === ""
          ? "flex"
          : "none";
    });

    // close menu if clicking outside header
    document.addEventListener("click", (event) => {
      if (!this.contains(event.target) && links.style.display === "flex") {
        links.style.display = "none";
      }
    });

    // window resize display reset for desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && links.style.display === "none") {
        links.style.display = "flex";
      }
    });

    // check if dark mode set in localStorage
    const darkMode = localStorage.getItem("dark-mode") === "true";
    if (darkMode) {
      document.body.classList.add("dark-mode");
      checkbox.checked = true;
    }

    // toggle dark mode
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("dark-mode", "true"); // save to localStorage
        console.log("Dark mode enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("dark-mode", "false"); // save to localStorage
        console.log("Dark mode disabled");
      }
    });
  }
}

customElements.define("my-cool-header", MyCoolHeader);
