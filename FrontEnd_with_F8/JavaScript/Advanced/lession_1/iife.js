// IIFE
// ;(function(message) {
//     console.log("Message: ", message);
// })('Chào bạn!')

const app = (function(){
    // Private
    cars = [];

    return {
        get(index) {
            return cars[index]
        },
        add(car) {
            cars.push(car)
        },
        edit(index, car) {
            cars[index] = car
        },
        delete(index) {
            cars.splice(index, 1)
        }
    }
})()