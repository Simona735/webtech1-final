const template = document.createElement('template');
template.innerHTML = `
        <div class="row">
            <h4 class="mt-2">Zmena amplitúdy</h4>
        </div>
            <style>
                #sliderInput, #numberInput, #sliderV{
                    display: none;
                }
            </style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        </div>
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