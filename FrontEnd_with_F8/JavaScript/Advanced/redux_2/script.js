/////////////////// MY REDUX //////////////////
function createStore(reducer) {
    let state = reducer(undefined, {})

    const subsrcibers = []

    return {
        getState() {
            return state
        },
        dispatch(action) {
            state = reducer(state, action)
            subsrcibers.forEach(subsrciber => subsrciber())
        },
        subsrcibe(subsrciber) {
            subsrcibers.push(subsrciber)
        }
    }
}


/////////////////// MY APP //////////////////
const initState = 0

function bankReducer(state = initState, action) {
    switch (action.type) {
        case 'DEPOSIT':
            return state + action.payload
        case 'WITHDRAW':
            return state - action.payload
        default:
            return state
    }
}

const store = window.store = createStore(bankReducer)

function actionDeposit(payload) {
    return {
        type: 'DEPOSIT',
        payload
    }
}
function actionWithdraw(payload) {
    return {
        type: 'WITHDRAW',
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

store.subsrcibe(() => {
    render()
})

function render() {
    const output = document.getElementById('output')
    output.innerText = store.getState()
}
render()