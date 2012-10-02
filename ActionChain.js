var ActionChain = function(config) {

    /**
     * Private variables.
     */
    var actionsTried = [];
    var actionsPerformed = [];
    var actionsPending = [];
    var chainFinish = false;
    var currentAction;

    var configAdapter = new ActionChainConfigAdapter(config);
    var actionChainConfig = configAdapter.getActionChainConfig();
    var stateMachineConfig = configAdapter.getStateMachineConfig();

    var sm = new StateMachine(stateMachineConfig);

    var self = this;

    /**
     * Private methods.
     */
    var runAction = function(action, id) {
        currentAction = action.name;
        if (actionsTried.indexOf(currentAction) == -1) {
            actionsTried.push(action.name);
        }

        if (action.startStates.indexOf(sm.getState()) > -1) {
            actionsPending.push(action.name);
            action.handler.call(self);
        }
    }

    /**
     * Public methods.
     */
    this.run = function() {
        chainFinish = false;
        actionsTried = $.merge($.merge([], actionsPerformed), actionsPending);

        for (var i = 0; i < actions.length; i++) {
            if ((actionsPerformed.indexOf(actions[i].name) == -1) && (actionsPending.indexOf(actions[i].name) == -1)) {
                runAction(actions[i], i);
            }
        }
        chainFinish = true;
    }

    this.pushPerformedAction = function(inputCode) {
        var actionName = inputCode.substring(0, inputCode.length - 7);
        var nameMatches = $.grep(actions, function (action) {
            return action.name == actionName;
        });

        if (nameMatches.length > 0) {
            actionsPerformed.push(actionName);
            actionsPending.splice(actionsPending.indexOf(actionName), 1);
        }
    }

    /**
     * Getters.
     */
    this.getData = function(actionName) {
        return sm.getData(actionName);
    }

    this.getStateMachine = function() {
        return sm;
    }

    this.reachedChainFinish = function() {
        return chainFinish;
    }

    /**
     * Setters.
     */
     this.setData = function(actionName, success, data) {
        if (success) {
            sm.input(actionName + "Success", data);
        } else {
            sm.input(actionName + "Failure", data);
        }
     }


    /**
     * Constructor code.
     */
    var actions = actionChainConfig.actions;

    this.success = actionChainConfig.success;
    this.failure = actionChainConfig.failure;

    sm.actionChain = this;
};