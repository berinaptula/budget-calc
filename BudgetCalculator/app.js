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
        addItem : function(type,des,val){
            var newItem,ID;
            if(data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1; 
            }else {
                ID = 0;
            }
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            }else if(type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            data.allItems[type].push(newItem);
            return newItem;

        },
        testing : function(){
            console.log(data);
        }
    }


})();

var UIController = (function () {
    var DOMstrings = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        addBtn: '.add__btn'


    };
    return {
        getInputs: function () {
            return {
                type: document.querySelector(DOMstrings.type).value,
                description: document.querySelector(DOMstrings.description).value,
                value: document.querySelector(DOMstrings.value).value,
            }
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
        var input = UIctrl.getInputs();
        budgetCtrl.addItem(input.type,input.description,input.value);

    }
    return {
        init: function () {
            console.log('App has started');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();