const namedayTemplate = document.createElement('template');
namedayTemplate.innerHTML = `
        <div class="card">
            <article class="card-group-item">
                <div class="filter-content" id="green-background">
                    <div class="card-body" >
                        <h6 class="title">Dnes má meniny..</h6>
                        <hr class="custom-hr">
                        <h6 class="title">Vyhľadaj meniny podľa dátumu</h6>
                        <div class="form-group">
                            <label for="name" class="control-label">Name</label>
                            <input type="text" name="name" class="form-control" id="name" value="test">
                        </div> 
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
            input[type="text"],
            input.form-control {
                background: transparent;
                color: white;
                border: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                -webkit-box-shadow: none;
                box-shadow: none;
                border-radius: 0;
            }
            
            input[type="text"]:focus,
            input.form-control:focus {
                -webkit-box-shadow: none;
                background: transparent;
                box-shadow: none;
                border-bottom: 1px solid #ffffff;
                color: white;
            }
        </style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
        `;

class NamesdayWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(namedayTemplate.content.cloneNode(true));
    }

    connectedCallback() {/*
        var namesdayList;
        var helperBox;
        var isDate;
        var namesdayWidgetDiscovered = false;
        var showTooltipOnFocus = true;

        $(document).ready(function() {
            loadNamesday(namesdayList).done(function(data) {
                namesdayList = $(data).find("zaznam");
                injectTodaysDateAndName();
            });
            $('#namesday-input').focus(onFocusFunc);
            $('#namesday-input').blur(onBlurFunc);
        });

        function onFocusFunc() {
            if(showTooltipOnFocus)
                showError();
        }

        function onBlurFunc() {
            showTooltipOnFocus = $('#namesday-input').hasClass("tooltipped") ? true : false;
            hideError();
        }

        function setupTooltipBoxValues() {
            let helperTextDate = "Zadajte správny dátum vo formáte <b>31.3.</b> alebo <b>31.03</b>";
            let helperTextName = "Zadajte celé meno, ktoré sa nachádza v <b>slovenskom, českom, rakúskom, poľskom alebo maďarskom</b> kalendári";
            let helperText = isDate ? helperTextDate : helperTextName;
            $('#namesday-input').attr("data-tooltip", helperText);
        }

        function loadNamesday(data) {
            return $.ajax({
                url: "./resources/meniny.xml",
                type: "GET",
                data: data
            });
        }

        function injectTodaysDateAndName() {
            let names = retrieveNameFromDate(getToday());
            let output = names[0].names.textContent;
            output = output.split(",");
            $("#namesday-today").append("<em><b>" + output + "</em></b>");
            let todaysDate = formatDate(getToday());
            $("#namesday-today-date").html("<b>" + todaysDate + "</b>");
        }

        function retrieveNameFromDate(date) {
            let names = [];
            let name;

            $(namesdayList).each(function(index, value) {
                if (value.children[0].textContent == date) {
                    $(value.children).each(function(index2, value2) {
                        //SKd is the same as SK but extended, so we do not need SKd
                        if (value2.nodeName != "SKd" && value2.nodeName != "den") {
                            name = {
                                nationality: value2.nodeName,
                                names: value2
                            };
                            names.push(name);
                        }
                    });
                    return false;
                }
            });
            return names;
        }

        function getToday() {
            let d = new Date();
            let day = d.getDate();

            //JS months start from zero, so to get the correct notation, add 1
            let month = d.getMonth() + 1;

            //Prepend zero if needed to match the date format of the attached XML
            if (day.toString().length == 1) {
                day = "0" + day.toString();
            }
            if (month.toString().length == 1) {
                month = "0" + month.toString();
            }
            return month.toString() + day.toString();
        }

        function formatDate(date) {
            let month = date[0].toString() + date[1].toString();
            let day = date[2].toString() + date[3].toString();
            return day + "." + month + ".";
        }

        function normalize(input) {
            input = input.toLowerCase();
            input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            input = input.replace(" ", "");
            return input;
        }

        function checkInputType(input) {
            let dateFormat = input.split('.').join("");
            isDate = $.isNumeric(dateFormat);
        }

        $("#namesday-input").on("keyup", function() {
            var value = $(this)
                .val()
                .toLowerCase();
            checkInputType(value);
            var result = [];
            jQuery.grep(
                namesdayList,
                function(n, i) {
                    //Check whether user is inputting date and if so, create a json with all
                    //namesday on that day. The for cycle starts at 1 because 0 is the date value.
                    if (n.children[0].textContent == convertDateToBigEndian(value)) {
                        addSearchResultsByDate(n.children, result);
                    }
                        //The user is propapbly inputting a name at this point, so check whether
                        //we have the expected name in our data and return it in json in the
                    //same fashion as before.
                    else {
                        addSearchResultsByName(n.children, value, result);
                    }
                },
                false
            );
            $("#result").empty();
            printResults(result);
            if (!value) {
                $("#result").empty();
            }
        });

        function addSearchResultsByDate(collection, result) {
            for (var i = 1; i < collection.length; ++i) {
                if (collection[i].tagName == "SK" || collection[i].tagName == "SKdni" || collection[i].tagName == "SKsviatky" || collection[i].tagName == "CZsviatky" ) {
                    continue;
                }
                var toReturn = {
                    name: formatSKdNames(collection[i].textContent),
                    country: collection[i].tagName,
                    date: collection[0].textContent
                };
                if(toReturn.name)
                    result.push(toReturn);
            }
        }

        function formatSKdNames(content) {
            let splitContent = content.split(",");
            let index = splitContent.indexOf("-");
            if(index < 0)
                return content;
            splitContent.splice(index, 1);
            return splitContent.toString();
        }

        function emptySKd(userInput, content) {
            return (normalize(userInput) == "-" && content.split(", ").includes("-"))
        }

        function addSearchResultsByName(collection, userInput, result) {
            for (var i = 1; i < collection.length; ++i) {
                //Since SK is just a subset of SKd, we do not need it
                if (collection[i].tagName == "SK" || collection[i].tagName == "SKdni" || collection[i].tagName == "SKsviatky" || collection[i].tagName == "CZsviatky" || emptySKd(userInput, collection[i].textContent)) {
                    continue;
                }
                splitArr = (collection[i].textContent.split(", "));
                for(var j = 0; j<splitArr.length; ++j){
                    if (normalize(splitArr[j])==(normalize(userInput))) {
                        var toReturn = {
                            name: formatSKdNames(collection[i].textContent),
                            country: collection[i].tagName,
                            date: collection[0].textContent
                        };
                        if(toReturn.name)
                            result.push(toReturn);
                    }
                }
            }
        }

        function showError() {
            if($('#namesday-input').hasClass("tooltipped")) return;
            setupTooltipBoxValues();
            $('#namesday-input').addClass("tooltipped");
            // Set delay for the tooltip to close to 100seconds
            $('.tooltipped').tooltip({exitDelay: 100000});
            helperBox = M.Tooltip.getInstance(document.querySelector('.tooltipped'));
            helperBox.open();
        }

        function hideError() {
            if(!$('#namesday-input').hasClass("tooltipped")) return;
            helperBox.close();
            helperBox.destroy();
            $('#namesday-input').removeClass("tooltipped");
        }

        function printResults(input) {
            if(input.length === 0) {
                showError();
                return;
            }
            hideError();
            input.forEach(element => {
                var toAppend =
                    '<li class="collection-item">' +
                    convertDateToLittleEndian(element.date) +
                    ". <i class=\"flag "+element.country.toLowerCase()+"\"></i>" +
                    element.name +
                    "<br></li>";
                $("#result").append(toAppend);
            });
        }

        function convertDateToLittleEndian(input) {
            return input[2] + input[3] + "." + input[0] + input[1];
        }

        function convertDateToBigEndian(value) {
            //Single digit day, single digit month (^\d\.\d\.?) "x.x."
            if (value.match(/(^\d\.\d\.?$)/)) {
                // console.log("0"+value[2]+"0"+value[0]);
                return "0" + value[2] + "0" + value[0];
            }

            //Single digit day, double digit month (^\d\.\d{2}\.?) "x.xx"
            else if (value.match(/(^\d\.\d{2}\.?$)/)) {
                // console.log(value[2]+value[3]+"0"+value[0]);
                return value[2] + value[3] + "0" + value[0];
            }

            //Double digit day, single digit month (^\d{2}\.\d\.?$) "xx.x"
            else if (value.match(/(^\d{2}\.\d\.?$)/)) {
                // console.log("0"+value[3]+value[0]+value[1]);
                return "0" + value[3] + value[0] + value[1];
            }

            //Ordinary double digit day, double digit month (^\d{2}\.\d{2}\.?$) "xx.xx"
            else if (value.match(/(^\d{2}\.\d{2}\.?$)/)) {
                // console.log(value[3]+value[4]+value[0]+value[1]);
                return value[3] + value[4] + value[0] + value[1];
            }

            //Retard-endian
            else if (!value.includes(".")) {
                return value;
            }

        }*/
    }
}
window.customElements.define("namesday-widget", NamesdayWidget);