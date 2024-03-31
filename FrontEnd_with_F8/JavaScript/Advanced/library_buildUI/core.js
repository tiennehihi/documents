export default function html([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first]
    )
    .filter(x => x && x !== true || x === 0)
    .join('')
}

export function createStore(reducer) {
    let state = reducer()
    const roots = new Map()
    // Map() là 1 obj đặc biệt nó khác obj thường là nó có tính chất lặp qua và key của nó có thẻ đặt bằng bất kỳ kiểu dữ liệu nào

    function render() {
        for(const [root, component] of roots) {
            const output = component()
            root.innerHTML = output
        }
    }

    return {
        // Nhận view và đẩy ra root
        attach(component, root) {
            roots.set(root, component)
            render()
        },
        // Kết nối giữa view và store
        // Selector là lựa chọn, vì view có thể là có nhiều màn hình, có thể đang ở màn hình home thì không cần tất cả dữm liệu trong store
        connect(selector = state => state) {
            return component => (props, ...args) =>
                component(Object.assign({}, props, selector(state), ...args))
                // props là những dữ liệu muốn truyền vào component
        },
        dispatch(action, ...args) {
            state = reducer(state, action, args)
            render()
        }
    }
}