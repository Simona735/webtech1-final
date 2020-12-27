const template = document.createElement('template');
template.innerHTML = `
        <nav class="navbar navbar-expand-md navbar-dark" id="navbar">
            <a href="#" class="navbar-brand d-flex align-items-center">
                <img src="../../resources/img/home.png" id="homeIcon" alt="Home icon">
                <strong class="ml-2">Domov</strong>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        
            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Link <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuGames" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Hry </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuGames">
                            <li><a class="dropdown-item" href="#">Anjel</a></li>
                            <li><a class="dropdown-item" href="#">Tučniak</a></li>
                            <li><a class="dropdown-item" href="#">Mikuláš</a></li>
                            <li><a class="dropdown-item" href="#">Snehuliak Olaf</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Info </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <li><a class="dropdown-item" href="../../subpages/sources.html">Zdroje</a></li>
                            <li class="dropdown-submenu"><a class="dropdown-item dropdown-toggle" href="#">O nás</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="../../subpages/about/rendek.html">Rendek Michal</a></li>
                                    <li><a class="dropdown-item" href="../../subpages/about/richterova.html">Richterová Simona</a></li>
                                    <li><a class="dropdown-item" href="../../subpages/about/ulrichova.html">Ulrichová Barbora</a></li>
                                    <li><a class="dropdown-item" href="../../subpages/about/vcelkova.html">Včelková Edita</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../../subpages/tasks.html">Zoznam úloh</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../../subpages/redistribution.html">Rozdelenie úloh</a>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
                    <button class="btn btn-light my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
        <style>
            #navbar{
                background: #750310;
            }
            
            #homeIcon{
                width: 20px;
                height: 20px;
            }
            
            .navbar-nav li:hover > ul.dropdown-menu {
                display: block;
            }
            .dropdown-submenu {
                position:relative;
            }
            
            .dropdown-menu {
                margin: 0; !important;
            }
            
            .dropdown-submenu>.dropdown-menu {
                top: 0;
                left: 100%;
                margin-top: -6px;
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
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
    }
}
window.customElements.define("navbar-menu", NavbarMenu);