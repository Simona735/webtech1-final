const counterTemplate = document.createElement('template');
counterTemplate.innerHTML = `
        <div class="card">
            <article class="card-group-item">
                <div class="filter-content" id="green-background">
                    <div class="card-body" >
                        <h6 class="title">Počítadlo prístupov</h6>
                        <hr class="custom-hr">
                        <span>Počet tvojich návštev:  
                            <div class="badge badge-light round" id="CounterVisitor">
                            </div>
                        </span>
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
        var counter = localStorage.getItem('on_load_counter');

        if (counter === null) {
            counter = 0;
        }

        counter++;

        localStorage.setItem("on_load_counter", counter);

        this.shadowRoot.getElementById('CounterVisitor').innerHTML = counter;

    }
}
window.customElements.define("counter-widget", CounterWidget);