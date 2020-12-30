const counterTemplate = document.createElement('template');
counterTemplate.innerHTML = `
        <div class="card">
            <article class="card-group-item">
                <div class="filter-content" id="green-background">
                    <div class="card-body" >
                        <h6 class="title">Počítadlo prístupov</h6>
                        <hr class="custom-hr">
                        <span class="float-left badge badge-light round">132</span>
                    </div> <!-- card-body.// -->
                </div>
            </article> <!-- card-group-item.// -->
        </div> <!-- card.// -->
        <style>
            #green-background{
                background-color: #365B24;
                color: white;
                border-radius: .25rem;
            }
            .custom-hr{
                border: 0;
                height: 0;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            }
        </style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        `;

class CounterWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(counterTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        window.addEventListener("load", showCounter(), false);

        function showCounter() {
            let visitCounter = getCookie("counter");
            if (visitCounter === "") {
                visitCounter = 0;
            }
            visitCounter++;
            writeCountToPage("visit-counter", visitCounter);
            setCookie("counter", visitCounter, 10);
        }

        function writeCountToPage(outputElement, count) {
            document.getElementById(outputElement).innerHTML = count;
        }

        function setCookie(name, value, expirationDays) {
            let expirationDate = getExpirationDate(expirationDays);
            let expires = formCookieExpiration(expirationDate);
            saveCookie(name, value, expires);
        }

        function getExpirationDate(expirationDays) {
            let expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
            return expirationDate;
        }

        function formCookieExpiration(expirationDate) {
            return "expires=" + expirationDate.toUTCString();
        }

        function saveCookie(name, value, expirationDate) {
            document.cookie = formCookieEntry(name, value, expirationDate);
        }

        function formCookieEntry(name, value, expires) {
            return name + "=" + value + ";" + expires + ";path=/";
        }

        function getCookie(name) {
            let searchedName = name + "=";
            let splittedCookies = getDecodedCookies().splitCookies();
            for (currentCookie of splittedCookies) {
                while (currentCookie.charAt(0) == ' ') {
                    currentCookie = currentCookie.substring(1);
                }
                if (currentCookie.indexOf(searchedName) == 0) {
                    return currentCookie.substring(searchedName.length, currentCookie.length);
                }
            }
            return "";
        }

        function getDecodedCookies() {
            this.value = decodeURIComponent(document.cookie);
            return this;
        }

        function splitCookies() {
            return this.value.split(";");
        }
    }
}
window.customElements.define("counter-widget", CounterWidget);