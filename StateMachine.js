var StateMachine = function(config) {
    var state = 0;  // Default state.
    var data = {};

    var finalStateReached = false;
    var success = false;
    var failure = false;

    var entryActionHandlers = {};
    var exitActionHandlers = {};
    var transitionActionHandlers = {};

    var self = this;


    /**
     * Final state handlers.
     */
    var failureHandler = function() {
        finalStateReached = true;
        failure = true;
    };

    var successHandler = function() {
    	finalStateReached = true;
	success = true;
    };

    var triggerFinal = function() {
        if (success) {
            self.actionChain.success.call(self.actionChain);
        } else if (failure) {
            self.actionChain.failure.call(self.actionChain);
        }
    }

    /**
     * Actions.
     */
    var entryAction = function(inputCode) {
        if (!finalStateReached) {
            console.log("Enter state " + state +".");

            if (typeof(entryActionHandlers[state]) == "function") {
                entryActionHandlers[state]();
            }
            if (finalStateReached) {
                triggerFinal();
            }
        } else {
            console.log("Final state already reached!");
        }
    };

    var exitAction = function(inputCode) {
        console.log("Exit from state " + state);

        if (typeof(exitActionHandlers[state]) == "function") {
            exitActionHandlers[state]();
        }

        self.actionChain.pushPerformedAction(inputCode);
    }

    var inputAction = function(inputCode, payload /* optional */) {
        console.log(inputCode + " happened." );

        if (typeof(payload) != "undefined") {
            var actionName = inputCode.substring(0, inputCode.length - 7);
            data[actionName] = payload;
        }
    }

    var transitionAction = function(inputCode) {
        var newState = stateTransitionTable[inputCode][state];

        exitAction(inputCode);

        console.log("Transition between " + state + " and " + newState);
        state = newState;

        if (typeof(transitionActionHandlers[state]) == "function") {
            transitionActionHandlers[state]();
        }

        entryAction(inputCode);

        if (this.actionChain.reachedChainFinish() && (!finalStateReached)) {
            this.actionChain.run();
        }
    }

    /**
     * Input function.
     */
    this.input = function(inputCode, payload /* optional */) {
        inputAction(inputCode, payload);

        if (!finalStateReached) {
            if (typeof(data) == "undefined") { data = {}; }
            var newState = stateTransitionTable[inputCode][state];

            if(state != newState) {
                transitionAction.call(this, inputCode, stateTransitionTable[inputCode][state]);
            }
        } else {
            console.log("Final state already reached!");
        }
    };

    /**
     * Getters.
     */
    this.getData = function(inputCode) {
        return data[inputCode];
    };

    this.getState = function() {
        return state;
    };

    /**
     * Constructor code.
     */
    var stateTransitionTable = config.stateTransitionTable;
    var finalStates = config.finalStates;

    entryActionHandlers[finalStates["success"]] = successHandler;
    entryActionHandlers[finalStates["failure"]] = failureHandler;
};
