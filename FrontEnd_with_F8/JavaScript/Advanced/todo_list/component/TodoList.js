import html from '../core.js'
import { connect } from '../store.js'
import TodoItem from '../component/TodoItem.js'

// const connector = connect()

function TodoList({ todos, filter, filters }) {
    // console.log(filters)
    // console.log(todos)
    return html`
        <section class="main">
            <input
                id="toggle-all"
                class="toggle-all"
                type="checkbox"
                onchange="dispatch('toggleAll', this.checked)"
                ${todos.every(filters.completed) && 'checked'}
            >
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                ${todos
                    .filter(filters[filter])
                    .map((todo, index) => 
                        TodoItem({ todo, index })
                )}
            </ul>
        </section>
    `
}

export default connect()(TodoList)
// export default connector(TodoList)