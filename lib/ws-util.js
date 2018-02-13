module.exports = (function() {
  return {
    labelTransformer: function(labelGenerator) {
      var length = 0
      return {
        length: length,
        labels: {},
        getLabel: function(label) {
          if (typeof label != 'undefined' && label in this.labels) {
            return this.labels[label]
          } else {
            var gen = labelGenerator(length++, label)
            this.labels[label] = gen
            return gen
          }
        }
      }
    },

    StrArr: function(str) {
      return {
        arr: str.split(''),
        pos: 0,
        line: 1,
        col: 1,
        hasNext: function() {
          return this.pos < this.arr.length
        },
        getNext: function() {
          var next = this.arr[this.pos++]
          if (next == '\n') {
            this.line++
            this.col = 1
          } else {
            this.col++
          }
          return next
        },
        peek: function() {
          return this.arr[this.pos]
        }
      }
    }
  }
})()
