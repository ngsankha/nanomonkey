var fs = require('fs'),
    esprima = require('esprima'),
    escodegen = require('escodegen');

var ANNOTATION_PATTERN = /@\w*/;
var EXPRESSION_PATTERN = /\{(.*?)\}/;

function parseBody(node) {
    for (var i = 0; node != undefined && i < node.body.length; i++) {
        switch (node.body[i].type) {
            case 'FunctionDeclaration':
                node.body[i] = parseFunction(node.body[i]);
                break;
        }
        node.body[i].body = parseBody(node.body[i].body);
    }
    return node;
}

function parseFunction(node) {
    var startLine = node.loc.start.line,
        endLine = node.loc.end.line;
    var annotation = searchComment(startLine - 1);
    if (annotation.type === 'Block') {
        var keyword = ANNOTATION_PATTERN.exec(annotation.value);
        switch (keyword[0]) {
            case '@precondition':
                var expr = EXPRESSION_PATTERN.exec(annotation.value);
                node.body.body = parsePrecondition(node.body.body, expr[1]);
                break;
        }
    }
    return node;
}

function searchComment(tillLine) {
    for (var i = 0; i < ast.comments.length; i ++) {
        if (ast.comments[i].loc.end.line === tillLine)
            return ast.comments[i];
    }
}

function parsePrecondition(functionNode, expression) {
    var preconditionObj = {
        type: 'IfStatement',
        test: { type: 'UnaryExpression',
                operator: '!',
                argument: esprima.parse(expression).body[0].expression,
                prefix: true
        },
        consequent: {
            type: 'BlockStatement',
            body: [{ type: 'ThrowStatement',
                     argument: {
                         type: 'NewExpression',
                         callee: {
                             type: 'Identifier',
                             name: 'Error'
                         },
                         arguments: [{ type: 'Literal',
                                       value: 'Precondition failed: ' + expression,
                                       raw: '"Precondition failed: ' + expression + '"'
                                    }]
                        }
                  }]
        },
        alternate: null
    };
    functionNode.splice(0, 0, preconditionObj);
    return functionNode;
}

var filename = process.argv[2];
var content = fs.readFileSync(filename);
var ast = esprima.parse(content, { loc: true,
                                   comment: true});
var newAST = parseBody(ast);
console.log(escodegen.generate(newAST));
