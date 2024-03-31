import { createStore } from 'https://cdn.skypack.dev/redux';


const initState = 0
const store = window.store = createStore(bankReducer);

function bankReducer(state = initState, action) {
    switch (action.type) {
        case 'deposit':
            return state + action.payload
        case 'withdraw':
            if ((state - action.payload) < 0) {
                return state
            } else {
                return state-action.payload;
            }
        default:
            return state
    }
}

function actionDeposit(payload) {
    return {
        type:'deposit',
        payload
    }
}
function actionWithdraw(payload) {
    return {
        type:'withdraw',
        payload
    }
}

const deposit = document.querySelector('#deposit')
const withdraw = document.querySelector('#withdraw')

deposit.onclick = function() {
    store.dispatch(actionDeposit(10))
}
withdraw.onclick = function() {
    store.dispatch(actionWithdraw(10))
}

store.subscribe(() => {
    render()
})


function render() {
    const output = document.querySelector('#output')
    output.innerText = store.getState()
}
render()