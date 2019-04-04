var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else {
            this.percentage = -1;
        }

    }
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        })
        data.allTotal[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        allTotal: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;

        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.allTotal.inc - data.allTotal.exp

            // If the INCOME is greater than 0, then calculate the percentage
            if (data.allTotal.inc > 0) {
                data.percentage = Math.round((data.allTotal.exp / data.allTotal.inc) * 100)
            }
            // Else set the percentage to -1
            else {
                data.percentage = -1;
            }
        },
        calculatePercentages : function(){

            data.allItems.exp.forEach(function(cur){
               return cur.calcPercentage(data.allTotal.inc);
            });

        },
        getPercentages : function(){
            var percentages;

            percentages = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return percentages;

        },
        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                income: data.allTotal.inc,
                expenses: data.allTotal.exp
            }
        },

        testing: function () {
            console.log(data);
        }
    }


})();

var UIController = (function () {
    var DOMstrings = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercLabel : '.item__percentage',
        dateLabel : '.budget__title--month'


    };
    var formatNumber = function(num,type) {
        var sumSplit,int,dec,type;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length >3 ) {
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);

        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }
    return {
        getInputs: function () {
            return {
                type: document.querySelector(DOMstrings.type).value,
                description: document.querySelector(DOMstrings.description).value,
                value: parseFloat(document.querySelector(DOMstrings.value).value),
            }
        },

        addItemList: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description"> %description% </div>
                    <div class="right clearfix">
                    <div class="item__value"> %value% </div>
                        <div class="item__delete">
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
                </div>
            </div>`
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-%id%">
                    <div class="item__description"> %description% </div>
                    <div class="right clearfix">
                        <div class="item__value"> %value% </div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`
            };

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },


        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.description + ', ' + DOMstrings.value);

            /*For older browsers which do not support calling .forEach to a NodeList.
            -------------------------------------------------
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = '';
            });
            fieldsArr[0].focus();
            -------------------------------------------------
            */

            // NodeList support browsers
            fields.forEach(function (current, index, array) {
                current.value = '';
            })

            fields[0].focus();
        },
        displayBudget: function (obj) {
            var budgetFormat
            obj.budget > 0 ? budgetFormat = 'inc' : budgetFormat = 'exp';
            document.querySelector(DOMstrings.budgetLabel).innerText = formatNumber(obj.budget,budgetFormat);
            document.querySelector(DOMstrings.expenseLabel).innerText = formatNumber(obj.expenses,'exp');
            document.querySelector(DOMstrings.incomeLabel).innerText = formatNumber(obj.income,'inc');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).innerText = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).innerText = "-";
            }


        },
        displayPercentages : function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.itemPercLabel);
            
            fields.forEach(function(current,index){
                if(percentages[index] > 0 ){
                    current.textContent = percentages[index] + "%";
                }else {
                    current.textContent = "-";
                }
            });
        },
        deleteListItem: function (selectorID) {
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        displayDate : function(){
            var year,months,month,now;

            now = new Date();

            months = [
                'January','February','March','April','May','June','July','August','September','October','Novemeber','December'
            ]
            year = now.getFullYear();
            month = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType : function() {
            var fields;

            fields = document.querySelectorAll(
                DOMstrings.type + ',' +
                DOMstrings.description + ','+
                DOMstrings.value
            );
            fields.forEach(function(cur) {
                cur.classList.toggle('red-focus');
            })

            document.querySelector(DOMstrings.addBtn).classList.toggle('red');

        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

var controller = (function (budgetCtrl, UIctrl) {
    var setupEventListeners = function () {
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.type).addEventListener('change',UIController.changedType);
        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    }

    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        budget = budgetCtrl.getBudget();
        UIctrl.displayBudget(budget);

    }

    var updatePercentages = function(){

        budgetCtrl.calculatePercentages();

        percentages =  budgetCtrl.getPercentages();

        console.log(percentages);
        UIctrl.displayPercentages(percentages);


    }
    var ctrlAddItem = function () {
        var input, newItem;
        input = UIctrl.getInputs();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // If input fields' value is a not empty and the the amount is a number & greater than 0, execute : 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UIctrl.addItemList(newItem, input.type);
            updateBudget();
            UIctrl.clearFields();
            updatePercentages();
        }
    }
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, ID, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');

            type = splitID[0];
            ID = Number(splitID[1]);

            budgetCtrl.deleteItem(type, ID);


            UIctrl.deleteListItem(itemID);

            updateBudget();
        }

    }
    return {
        init: function () {
            UIctrl.displayDate();
            UIctrl.displayBudget({
                budget: 0,
                percentage: '',
                income: 0,
                expenses: 0
            });
            console.log('App has started');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();