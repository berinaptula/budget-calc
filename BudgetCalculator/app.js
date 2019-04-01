var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        allTotal: {
            exp: 0,
            inc: 0
        }
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
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',


    };
    return {
        getInputs: function () {
            return {
                type: document.querySelector(DOMstrings.type).value,
                description: document.querySelector(DOMstrings.description).value,
                value: document.querySelector(DOMstrings.value).value,
            }
        },

        addItemList: function (obj, type) {
            var html,newHtml,element;

            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-%id%">
                <div class="item__description"> %description% </div>
                    <div class="right clearfix">
                    <div class="item__value"> %value% </div>
                        <div class="item__delete">
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
                </div>
            </div>`
            }else if (type ==='exp'){
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="expense-%id%">
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

            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },



        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

var controller = (function (budgetCtrl, UIctrl) {
    var setupEventListeners = function () {
        var DOM = UIctrl.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        })

    }


    var ctrlAddItem = function () {
        var input,newItem;
        input = UIctrl.getInputs();

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        UIctrl.addItemList(newItem,input.type);

    }
    return {
        init: function () {
            console.log('App has started');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();