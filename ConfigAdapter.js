/**
 * Configuration adapter for Action Chain and State Machine.
 */
var ActionChainConfigAdapter = function(actionChainConfig) {
    var stateMachineConfig = {};
    var actions = actionChainConfig.actions;

    var actionsMap = $.map(actions, function(action, i) {
        return action.name;
    });

    /**
     * ActionChain configuration functions.
     */
    var getStartStates = function(dependencies) {
        if (typeof(dependencies) == "undefined") {
            dependencies = [];
        }
        var startStates = [];
        var push = false;

        for (var k = 0; k < Math.pow(2, actionsMap.length); k++) {
            push = true;
            $.each(dependencies, function(i, actionName) {
                if (parseInt(k & Math.pow(2, (actionsMap.indexOf(actionName)))) <= 0) {
                    push = false;
                    return false;
                }
                push = true;
            });
            if (push) {
                startStates.push(k);
            }
        }
        return startStates;
    };

    var modifyActionsConfig = function() {
        $.each(actions, function(i, action) {
            action.startStates = getStartStates(action.dependencies);
        });
    };


    /**
     * StateMachine configuration functions.
     */
    var getTransitionTable = function() {
        var transitionTable = {};
        $.each(actionsMap, function(i, name) {
            transitionTable[name+"Success"] = [];
            transitionTable[name+"Failure"] = [];

            for (var j = 0; j < Math.pow(2, actionsMap.length); j++) {
                transitionTable[name+"Success"][j] = (Math.pow(2, i) | j);
                transitionTable[name+"Failure"][j] = -1;
            }
        });

        return transitionTable;
    }

    var createStateMachineConfig = function() {
        stateMachineConfig.stateTransitionTable = getTransitionTable();
        stateMachineConfig.finalStates = {
            "success": Math.pow(2, actionsMap.length) - 1,
            "failure": -1
        }
    }


    /**
     * Getters.
     */
     this.getStateMachineConfig = function() {
        return stateMachineConfig;
     }

     this.getActionChainConfig = function() {
        return actionChainConfig;
     }

    /**
     * Constructor code.
     */
    modifyActionsConfig();
    createStateMachineConfig();
}