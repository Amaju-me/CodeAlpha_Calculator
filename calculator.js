const body = document.querySelector("body");
const filterHd = document.querySelector("#filter-hd");
const keyIconL = document.querySelector(".keyIconL");
const keyIconR = document.querySelector(".keyIconR");
const leftKeyboard = document.querySelector(".left");
const rightKeyboard = document.querySelector(".right");
const defaultKeyboard = document.querySelector(".default");
const displayScreen = document.querySelector("#display-screen");
const display = document.querySelector("#display");

keyIconL.addEventListener("click", () => {
    
    leftKeyboard.style.display = "inline-grid";
    filterHd.style.display = "none";
    defaultKeyboard.style.display = "none";
    displayScreen.style = "height: 93.75%; width: 49.35%; position: absolute; top: 2.22rem; right: 0.125rem";
    display.style = "height: 80%; width: 80%; font-size: 3.3rem;";
    document.querySelector(".xL").addEventListener("click", () => {
        leftKeyboard.style.display = "";
        filterHd.style.display = "";
        defaultKeyboard.style.display = "";
        display.style = "";
        displayScreen.style = "";
    })
});

keyIconR.addEventListener("click", () => {
    rightKeyboard.style.display = "inline-grid";
    filterHd.style.display = "none";
    defaultKeyboard.style.display = "none";
    displayScreen.style = "height: 93.75%; width: 49.35%; position: absolute; top: 2.22rem; left: 0.125rem";
    display.style = "height: 80%; width: 80%; font-size: 3.3rem;";
    document.querySelector(".xR").addEventListener("click", () => {
        rightKeyboard.style.display = "";
        filterHd.style.display = "";
        defaultKeyboard.style.display = "";
        display.style = "";
        displayScreen.style = "";
    })
});

function scrollToBotton() {
    display.scrollTop = display.scrollHeight;
}

const buttons = document.querySelectorAll(".button");
buttons.forEach(btn => {
    btn.style = "filter: drop-shadow(7px 6px 0 rgb(45, 45, 45));";

    btn.addEventListener("click", () => {
        btn.style = "transform: scale(0.97)";

        setTimeout( () => {
            btn.style = "filter: drop-shadow(7px 6px 0 rgb(48,48,48))";
        }, 115);

        if (btn.id == "Backspace") {

            backspace();

            scrollToBotton();

        }  else if (btn.id == "AC") {

            display.innerText = "";
            scrollToBotton();

        }  else if (btn.id == "=") {

            try {

                detectProblem_GetResult();

                scrollToBotton();

            } catch (error) {

                display.innerText = "Error";

                scrollToBotton();
            }
            
        } else {

            if (display.innerText.includes("Error")) {
                display.innerText = "";
            }

            display.innerText += btn.id;
            scrollToBotton();
        }

    })
});

function backspace() {
    let fullText = display.innerText;
    let lines = fullText.split("\n");

    if (fullText === "") {
        return "";
        
    } else if (fullText === "Error") {
        display.innerText = "";

    } else if (lines[lines.length - 1] === "") {
        let lastLine = lines[lines.length - 2];
        fullText = fullText.slice(0, - (lastLine.length + 1));
        display.innerText = fullText;
                
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
}

function detectProblem_GetResult() {

    let fullText = display.innerText.replace(/\n\n/g, "\n");
    display.innerText = fullText;

    let lines = fullText.split(/\n/g);
    let problem = lines[lines.length - 1].trim();

    if (problem === "") {
        lines.pop();
        problem = lines[lines.length - 1].trim();
    }

    if (problem.startsWith("=")) {
        problem = problem.slice(1).trim();
    }

    if ("+*-/".includes(problem[0])) {
        for (let i = lines.length - 2; i >=0; i--) {
            const prevLine = lines[i].trim();

            if ((!prevLine.startsWith("=")) && (prevLine !== "")) {
                const match = lines[i + 1]?.trim();

                if (match && match.startsWith("=")) {
                    const previousResult = match.slice(1).trim();
                    problem = previousResult + problem;
                }
                break;
            }
        }
    }

    while ((problem.includes("(")) && (problem.includes(")"))) {

        problem = problem
            .replace(/(?:\d+(\.\d+)?|\.\d+)(?=\()/g, match => `${match}*`)
            .replace(/\)(?=\d+(\.\d+)?)/g, ")*")
            .replace(/\)\(/g, ")*(")
            .replace(/\([^()]*\)/g, match => {
            const inner = match.slice(1, -1);
            const result = solution(inner);
            return result.toString();
        });
    }

    const result = solution(problem);
    display.innerText += `\n= ${result}\n`;

    if (isNaN(result)) {
        display.innerText = "Error";
    }

    display.innerText = display.innerText.replace(/\n\n/g, "\n");
    scrollToBotton();

}

function solution(problem) {
    const expression = express(problem);
    if (!expression || expression.length === 0) return "Error";

    let i = 0;
    while (i < expression.length) {
        if ((expression[i] === "*") || (expression[i] === "/")) {
            const leftNum = parseFloat(expression[i - 1]);
            const rightNum = parseFloat(expression[i + 1]);

            if (isNaN(leftNum) || isNaN(rightNum)) {
                return 'Error';
            }

            const result = (expression[i] === "*") ? leftNum * rightNum : leftNum / rightNum ;
            expression.splice(i - 1, 3, result.toString());
            i--;
        } else {
            i++;
        }
    }

    let result = parseFloat(expression[0]);
    for (let j = 1; j < expression.length; j += 2) {
        const operator = expression[j];
        const num = parseFloat(expression[j + 1]);

        if (operator === "+") {
            result += num;
        } else if (operator === "-") {
            result -= num;
        }
    }

    if (isNaN(result)) {
        return "Error";
    }

    return result;
}

function express(problem) {
    const elements = [];
    let sortChars = "";

    for (let i = 0; i < problem.length; i++) {
        const char = problem[i];

        if ("+*-/".includes(char)) {

            if ((char === "-") && ((i === 0) || ("*+(=-/".includes(problem[i - 1])))) {
                sortChars += char;

            } else {

                if (sortChars) {
                    elements.push(sortChars);
                }

                elements.push(char); // an operator
                sortChars = "";
            }
        } else {
            sortChars += char;
        }
    }

    if (sortChars) {
        elements.push(sortChars);
    }

    return elements;
}

body.addEventListener("keydown", (event) => {

    buttons.forEach(btn => {

        if (['1','2','3','4','5','6','7','8','9','0','.','+','-','*','/','=','(',')','!','%','Backspace','Enter'].includes(event.key)) {

            if ((event.key === btn.id) || ((btn.id === 'AC') && (event.key === 'Enter'))) {

                if ((event.key === 'Backspace') || (event.key === 'Enter')) {
                    btn.style = "transform: scale(0.97); background-color: rgb(227, 71, 43)";
                } else if (event.key === '=') {
                    btn.style = "transform: scale(0.97); background-color: rgb(65, 65, 65)";
                } else {
                    btn.style = "transform: scale(0.97); background-color: rgb(151, 179, 232);";
                }

                setTimeout( () => {
                    btn.style = "filter: drop-shadow(7px 6px 0 rgb(48,48,48))";
                }, 115);
            }
        }
        
    });

    if (!['1','2','3','4','5','6','7','8','9','0','.','+','-','*','/','=','(',')','!','%','Backspace','Enter'].includes(event.key)) {
        display.innerText;
    } else if (['1','2','3','4','5','6','7','8','9','0','.','+','-','*','/','=','(',')','!','%','Backspace','Enter'].includes(event.key)) {
        if (event.key === 'Backspace') {

            backspace();
            scrollToBotton();

        } else if (event.key === 'Enter') {
            display.innerText = "";
            scrollToBotton();

        } else if (event.key === '=') {
            try{
                detectProblem_GetResult();
                scrollToBotton();

            } catch (error) {
                display.innerText = "Error";
                scrollToBotton();
            }
        } else {

            if (display.innerText.includes("Error")) {
                display.innerText = "";
            }

            display.innerText += event.key;
            scrollToBotton();
        }
    }

})