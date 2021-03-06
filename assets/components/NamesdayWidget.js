const namedayTemplate = document.createElement('template');
namedayTemplate.innerHTML = `
        <div class="card" id="meninyBody">
            <article class="card-group-item">
                <div class="filter-content" id="green-background">
                    <div class="card-body" >
                        <h6 class="title">Meniny</h6>
                        <hr class="custom-hr">
                        <div class="mb-3" id="actual"></div>
                        <form>
                            <input class="form-control mb-2 mr-sm-2" type="text" placeholder="Zadaj meno alebo dátum" id="input" data-toggle="tooltip" data-trigger="manual" data-placement="bottom" aria-label="Hľadaj">
                            <button id="search-button" type="button" class="btn btn-light mb-2 mr-sm-2">Hľadaj</button>
                            <span class="mb-2" id="output"></span>
                        </form>
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
            }/*
            input[type="text"],
            input .form-control {
                width 50%;
                padding: .375rem .75rem;
                border: none;
                background: white;
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                -webkit-box-shadow: none;
                box-shadow: none;
                border-radius: .25rem;
                transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
            }*/
            
            input[type="text"]:focus,
            input .form-control:focus {
                background: white;
                border-color: white;
            }
        </style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        <!--   
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>        
        -->     
        `;

class NamesdayWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(namedayTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        let component = this;

        //dictionary formated key[day] - value[names]
        var dict1 = {};

        //dictionary formated key[name] - value[day], each key consist from one name, so if one day have multiple ones, they appear as independent keys
        var dict2 = {};

        //onload function just to get data from json

        $.getJSON("/~xrichterova/Zfinal/data/name_days.json", function(json) {
            set(json.meniny.zaznam);
        })

        //function to show current date with name + fill dictionaries
        function set(json) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = 'Dnes je ' + dd + '.' + mm + '.' + yyyy;
            var q = mm + dd;

            //first dict
            json.forEach(function(x) {
                dict1[x.den] = x.SK;
            });

            //sec dict where we check if one day includes more than one name, if so we split it and make dict entries for every single one
            json.forEach(function(x) {
                if(x.SK) {
                    if ((x.SK).includes(', ')) {
                        var names = (x.SK).split(', ');
                        names.forEach(function(q) {
                            dict2[q] = x.den;
                        })
                    } else {
                        dict2[x.SK] = x.den;
                    }
                }
            });
            var name;
            if (dict1[q] === undefined)
            {
                name = '';
            } else{
                name = ' a meniny má ' + dict1[q];
            }
            //find name for current date 'q'
            //

            component.shadowRoot.getElementById('actual').innerText = today + "  " + name;
        }

        //main fn to get name or date
        this.shadowRoot.getElementById("search-button").addEventListener("click", () => {
            var checker = false;
            this.shadowRoot.getElementById("output").innerHTML = "";
            var input = this.shadowRoot.getElementById("input").value;

            try {

                //if input contains number, we presume that we are going to translate date to name
                if (hasNumber(input)) {
                    var date = input.split(".");
                    //checker for correct date input DD.MM, if input is correct, date.length have to be 2, othervise it means that they used wrong separator or no one
                    if (date.length != 3 || date[2] !="") {
                        throw 'Error1';
                    }
                    //filling day and month numbers if it consist from one digit with zerro (form 3.12 --> 03.12)
                    if (date[0].length === 1) {
                        date[0] = "0" + date[0];
                    }
                    if (date[1].length === 1) {
                        date[1] = "0" + date[1];
                    }
                    //q is our final date DDMM
                    var q = date[1] + date[0];
                    //date ist not included in dict --> it is not real one
                    console.log(dict1);
                    if (q === "0101" || q === "0501" || q === "1102" || q === "1225"){
                        throw 'Error4';
                    }
                    if (dict1[q] === undefined) {
                        throw 'Error2';
                    }

                    //if we got here it means we have correct answer so just put it into output
                    this.shadowRoot.getElementById("output").innerHTML = "Meniny má " + dict1[q];
                }
                //input doesnt contain number so we presume that we are going to translate name to date
                else {
                    input = normalizeString(input);

                    //simple for each loop to compare input with our dict2
                    Object.keys(dict2).forEach(function(key) {
                        var name = normalizeString(key);
                        //found it
                        if (name === input) {
                            //change checker to true so we know we found it
                            checker = true;
                            component.shadowRoot.getElementById("output").innerHTML = ("Meniny má dňa " + dict2[key].substring(2, 4) + "." + dict2[key].substring(0, 2) + ".");
                        }


                    });
                    //checker is false so we didnt find that input in our dict2 so we presume input name was not correct
                    if (!checker) throw 'Error3';
                }
            } catch (e) {
                if (e === 'Error1') {
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip({ title: "Chybne zadaný formát dátumu DD.MM." });
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip('show');
                } else if (e === 'Error2') {
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip({ title: "Zadaný dátum je chybný, máte správne poradie DD.MM.? " });
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip('show');
                } else if (e === 'Error3') {
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip({ title: "Chybne zadané meno" });
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip('show');
                } else if (e === 'Error4') {
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip({ title: "V tento deň je sviatok" });
                    $(this.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip('show');
                }
                setTimeout(function() {
                    $(component.shadowRoot.querySelector('[data-toggle="tooltip"]')).tooltip('dispose');
                }, 2500);
            }
        });

        //fn to get rid of Upper-cases and no standard characters such as á,š etc...
        function normalizeString(string) {
            var input = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            input = input.toLowerCase();
            return input;
        }


        //no need to comment
        function hasNumber(myString) {
            return /\d/.test(myString);
        }
    }
}
window.customElements.define("namesday-widget", NamesdayWidget);