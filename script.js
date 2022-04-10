

let operators = {
    '%': 2,
    '*': 2,
    '/': 2,
    '^': 2,
    '+': 1,
    '-': 1
};

function toPostfix(expression) {
    let stack = [];
    let post = [];

    expression = expression.replace(/\s+/g, '');
    expression = expression.replace(/--/g, '+');
    expression = expression.replace(/\+-/g, '-');
    expression = expression.replace(/(\*|\/)-([0-9.]+)/g, "$1(0-$2)");
    expression = expression.replace(/(\*|\/)-\((.+?)\)/g, "$1(0-($2))");
    expression = expression.replace(/\(-/g, "(0-");

    for (let i = 0; i < expression.length; i++) {
        let c = '' + expression[i];
        let u = null;

        if (c in operators) {
            while (stack.length > 0 && operators[c] <= operators[stack[stack.length - 1]]) post.push(stack.pop());
            stack.push(c);
        } else if (c === '(') {
            stack.push(c);
        } else if (c === ')') {
            while ((u = stack.pop()) !== '(') post.push(u);
        } else if (c === ' ') {
        } else if (c === '=') {
            stack.push('=');
        } else if (/[0-9]/.test(c)) {
            while (i < expression.length - 1 && /^[0-9.]$/.test(expression[i + 1])) c += expression[++i];
            post.push(+c);
        } else if (/[a-z]/i.test(c)) {
            while (i < expression.length - 1 && /[a-z]/i.test(expression[i + 1])) c += expression[++i];
            post.push(c);
        }
    }

    return post.concat(stack.reverse());
}

function Interpreter() {
    this.vars = {};
}

Interpreter.prototype.eval = function (value) {
    if (/^[a-z]/i.test(value)) {
        if (!(value in this.vars)) throw new Error(value + ' is not defined');
        return this.vars[value];
    } else return value;
};

Interpreter.prototype.input = function (expression) {
    let postfix = toPostfix(expression);
    let stack = [];
    for (let i = 0; i < postfix.length; i++) {
        let c = postfix[i];
        if (c == +c) {
            stack.push(+c);
        } else if (c in operators) {
            let a = this.eval(stack.pop()), b = this.eval(stack.pop());
            switch (c) {
                case '+': stack.push(a + b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(b / a); break;
                case '-': stack.push((b || 0) - a); break;
                case '%': stack.push(b % a); break;
            }
        } else if (c === '=') {
            let value = stack.pop(), name = stack.pop();
            this.vars[name] = value;
            stack.push(value);
        } else {
            stack.push(c);
        }
    }
    let s = stack.pop();
    return s ? this.eval(s) : '';
};
