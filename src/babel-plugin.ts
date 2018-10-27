module.exports = function(babel) {
  const { types: t } = babel

  function classMethod(name, ret) {
    return t.classMethod(
      'method',
      t.identifier(name),
      [],
      t.blockStatement([t.returnStatement(ret)])
    )
  }

  return {
    name: 'ast-transform', // not required
    visitor: {
      ObjectProperty(path) {
        let value = path.get('value')
        if (
          ['StringLiteral', 'NumericLiteral', 'ArrayExpression'].indexOf(
            value.type
          ) === -1
        )
          return
        let next = t.newExpression(
          t.classExpression(
            null,
            null,
            t.classBody([
              classMethod(
                'pos',
                t.arrayExpression([
                  t.numericLiteral(path.node.value.loc.start.line),
                  t.numericLiteral(path.node.value.loc.start.column),
                  t.numericLiteral(path.node.value.loc.end.line),
                  t.numericLiteral(path.node.value.loc.end.column)
                ])
              ),
              classMethod('valueOf', t.cloneNode(path.node.value))
            ])
          ),
          []
        )
        value.replaceWith(next)
      }
    }
  }
}
