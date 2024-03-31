e instanceof Error))
        base = Object.assign(new Error(base.message), base);
    throw base;
}
function augmentCodeLocation(props, pos, source, id) {
    if (typeof pos === 'object') {
        const { line, column } = pos;
        props.loc = {