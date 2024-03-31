// import { createStore } from 'https://cdn.skypack.dev/redux';


/////////////////// MY REDUX //////////////////
function createStore(reducer) {
    let state = reducer(undefined, {})
    // console.log(state)
    // Nếu không truyền undefined vào thì sẽ bị hiện lỗi, state sẽ gọi callback ra ngoài 'bankReducer' trong đó thì 
    // state gán gtri mặc định = 0, nhưng action không có giá trị mặc định nên nó sẽ là undefined nhưng bên trong lại 
    // sử dụng action.type => undefined.type sẽ văng ra rối cannot get property type of undefined 
    // nên sẽ truyền vào undefined coi như là không truyền, nó sẽ lấy giá trị mặc định (giá trị khởi tạo)
    // và tham số thứ 2 truyền Object rỗng {} và khi object.type thì nó sẽ không lỗi, sẽ không lọt vào 2 case đầu mà lọt vào case cuối

    const subscribers = []

    return {
        getState() {
            return state
        },
        dispatch(action) {
            // console.log(action)
            state = reducer(state, action)
            // return state
            subscribers.forEach(subscriber => subscriber())
        },
        subscribe(subscriber) {
            subscribers.push(subscriber)
        }
    }
}





/////////////////// MY APP //////////////////
const initSate = 0

// 
// Reducer 
function bankReducer(state = initSate, action) {
    switch(action.type) {
        case 'DEPOSIT':
            return state + action.payload;
        case 'WITHDRAW':
            return state - action.payload;
        default:
            return state;
    }
}

// Store
const store = window.store = createStore(bankReducer)

// Actions
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

// DOM event
const deposit = document.querySelector('#deposit')
const withdraw = document.querySelector('#withdraw')

// Event handler
deposit.onclick = function () {
    store.dispatch(actionDeposit(10))
}
withdraw.onclick = function () {
    store.dispatch(actionWithdraw(10))
}

// Listener
store.subscribe(() => {
    // console.log('State vừa update xong !')
    render();
})

// store.subscribe(() => {
//     console.log('State vừa update xong 1 !')
// })
// store.subscribe(() => {
//     console.log('State vừa update xong 2 !')
// })


// console.log(store.getState())
function render() {
    const output = document.querySelector('#output')
    output.innerText = store.getState()
}

render()