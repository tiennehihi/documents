const root = document.getElementById('root')


const ulReact = React.createElement(
    'ul',
    null,
    React.createElement(
        'li',
        null,
        'JavaScript'
    ),
    React.createElement(
        'li',
        null,
        'ReactJS'
    )
)
// ReactDOM.render(ulReact, root)


const h1React = React.createElement(
    'h1',
    {
        title: 'Hello',
        className: 'heading'
    },
    'Hello Guys !!'
)
// React@17
ReactDOM.render(h1React, root)


// React@18
// const container = document.getElementById('root')
// const root = ReactDOM.createRoot(container)
// root.render(h1React)