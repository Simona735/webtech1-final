const template = document.createElement('template');
template.innerHTML = `
        <aside class="col-md-2 mt-3">
                <div class="card">
                    <article class="card-group-item">
                        <header class="card-header">
                            <h6 class="title">Meninový kalendár</h6>
                        </header>
                        <div class="filter-content">
                            <div class="card-body">
                                <div class="custom-control custom-checkbox">
                                    <span class="float-right badge badge-light round">52</span>
                                    <input type="checkbox" class="custom-control-input" id="Check1">
                                    <label class="custom-control-label" for="Check1">Samsung</label>
                                </div> <!-- form-check.// -->

                                <div class="custom-control custom-checkbox">
                                    <span class="float-right badge badge-light round">132</span>
                                    <input type="checkbox" class="custom-control-input" id="Check2">
                                    <label class="custom-control-label" for="Check2">Black berry</label>
                                </div> <!-- form-check.// -->
                            </div> <!-- card-body.// -->
                        </div>
                    </article> <!-- card-group-item.// -->
                </div> <!-- card.// -->
            </aside>
        <style>
        </style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        `;

class NamesdayWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        var numberInput = this.shadowRoot.querySelector('#numberInput');
        var sliderInput = this.shadowRoot.querySelector('#sliderInput');

        var sliderBox = this.shadowRoot.querySelector('#sliderBox');
        var numberBox = this.shadowRoot.querySelector('#numberBox');

        var rangeV = this.shadowRoot.querySelector('#sliderV');

        amplitudeValues( numberBox, numberInput );
        amplitudeValues( sliderBox, sliderInput );

        function amplitudeValues( box, input ){
            input.max = 20;
            input.min = -20;
            input.defaultValue=1;
        }

        sliderBox.addEventListener("click", () => {
            if(sliderBox.checked){
                sliderInput.style.display = "block";
                rangeV.style.display = "block";
            } else{
                sliderInput.style.display = "none";
                rangeV.style.display = "none";
            }
        });

        const
            setValue = ()=>{
                const
                    newValue = Number( (sliderInput.value - sliderInput.min) * 100 / (sliderInput.max - sliderInput.min) ),
                    newPosition = 15 - (newValue *0.7);
                rangeV.innerHTML = `<span>${sliderInput.value}</span>`;
                rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
            };
        this.shadowRoot.addEventListener("DOMContentLoaded", setValue);
        sliderInput.addEventListener('input', setValue);
        numberInput.addEventListener('input', setValue);
    }
}
window.customElements.define("namesday-widget", NamesdayWidget);