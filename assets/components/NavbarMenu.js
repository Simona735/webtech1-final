const navbarTemplate = document.createElement('template');
navbarTemplate.innerHTML = `
        <nav class="navbar navbar-expand-md navbar-dark" id="navbar">
            <a href="/~xrichterova/Zfinal/index.html" class="navbar-brand d-flex align-items-center">
                <img src="/~xrichterova/Zfinal/assets/img/snowflake.svg" id="homeIcon" alt="Home icon">
                <strong class="ml-2">Domov</strong>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto" id="menuContent">
                </ul>
            </div>
        </nav>
        <style>
            #navbar{
                background: #750310;
            }
            
            #homeIcon{
                width: 25px;
                height: 25px;
            }
            
            .navbar-nav li:hover > ul.dropdown-menu {
                display: block;
            }
            .dropdown-submenu {
                position:relative;
            }
            
            li .dropdown-menu{
                margin: 0;
            }
            
            .dropdown-submenu>.dropdown-menu {
                top: 0;
                left: 100%;
                /*margin-top: -6px;*/
            }
            
            /* rotate caret on hover */
            .dropdown-menu > li > a:hover:after {
                text-decoration: underline;
                transform: rotate(-90deg);
            }
        </style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        `;

class NavbarMenu extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(navbarTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        var menu = this.shadowRoot.getElementById("menuContent");
        let rootPath = "/~xrichterova/Zfinal";

        fetch('/~xrichterova/Zfinal/data/menu.json')
            .then(response => response.json())
            .then(json => {
                json.menuItems.forEach((item) => {
                    //1-level submenu
                    let menuItem = document.createElement("li");
                    menuItem.classList.add("nav-item");
                    let menuItemLink = document.createElement("a");
                    menuItemLink.classList.add("nav-link");
                    menuItemLink.innerHTML = item.text;

                    if ("children" in item) {
                        //2-level submenu

                        menuItem.classList.add("dropdown");
                        menuItemLink.classList.add("dropdown-toggle");
                        menuItemLink.setAttribute("href", "#");
                        menuItemLink.setAttribute("data-toggle", "dropdown");
                        menuItemLink.setAttribute("aria-haspopup", "true");
                        menuItemLink.setAttribute("aria-expanded", "false");

                        let submenu = document.createElement("ul");
                        submenu.classList.add("dropdown-menu");
                        item.children.forEach((subItem) => {
                            let submenuItem = document.createElement("li");
                            let submenuItemLink = document.createElement("a");
                            submenuItemLink.classList.add("dropdown-item");
                            submenuItemLink.innerHTML = subItem.text;
                            if ("children" in subItem){
                                //3-level submenu

                                submenuItem.classList.add("dropdown-submenu");
                                submenuItemLink.classList.add("dropdown-toggle");
                                submenuItemLink.setAttribute("href", "#");
                                submenuItem.appendChild(submenuItemLink);
                                let subsubmenu = document.createElement("ul");
                                subsubmenu.classList.add("dropdown-menu");
                                subItem.children.forEach((subsubItem) => {
                                    let subsubMenuItem = document.createElement("li");
                                    let subsubMenuItemLink = document.createElement("a");
                                    subsubMenuItemLink.classList.add("dropdown-item");
                                    subsubMenuItemLink.setAttribute("href", rootPath + subsubItem.href );
                                    subsubMenuItemLink.innerHTML = subsubItem.text;
                                    subsubMenuItem.appendChild(subsubMenuItemLink);
                                    subsubmenu.appendChild(subsubMenuItem);
                                });
                                submenuItem.appendChild(subsubmenu);
                            } else {
                                submenuItemLink.setAttribute("href", rootPath + subItem.href);
                                submenuItem.appendChild(submenuItemLink);
                            }
                            submenu.appendChild(submenuItem);
                        });
                        menuItem.appendChild(menuItemLink);
                        menuItem.appendChild(submenu);
                    } else {
                        menuItemLink.setAttribute("href", rootPath + item.href);
                        menuItem.appendChild(menuItemLink);
                    }
                    menu.appendChild(menuItem);
                });
            });
    }
}
window.customElements.define("navbar-menu", NavbarMenu);