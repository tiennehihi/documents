// Write a JavaScript function that accepts a string as a parameter and converts the first letter of each word of the string in uppercase

// - **Example**
//     - For `"the quick brown fox"`; Print `"The Quick Brown Fox"`
//     - For `"java script"`; Print `"Java Script"`
// - **Input**: str
// - **Output**: Converts the first letter of each word of the string in upper case

/**
 * ### **Suggestion**

- Use split method to split string str to array of words by space
- Use `for` or `foreach` or `array.map` to loop this array
- Use uc_first function to convert each word in array
- Join array of words to new string (Remember Array.join())
 */

function capitalize(str) {
    strArr = str.split(" ")
    strArr.forEach((value, index) => {
        // strArr[index] = value.charAt(0).toUpperCase() + value.slice(1)
        strArr[index] = value.charAt(0).toUpperCase() + value.substr(1)
    })
    return strArr.join(" ")
}

console.log(capitalize("the quick brown fox"))