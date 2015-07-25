var classNames = require('classnames');

var LayoutRow = React.createClass({
  render () {
    return (
      <div className="row">
        {this.props.children}
      </div>
    );
  }
});

var LayoutColumn = React.createClass({
  getBootStrapClassName (screenSize, columnValue) {
    return ['col', screenSize, columnValue].join('-');
  },
  getBootStrapClassSet (config) {
    var classes = {};
    for (var screenSize in config) {
      classes[this.getBootStrapClassName(screenSize, config[screenSize])] = true;
    }
    return classNames(classes);
  },
  render () {
    var columnSpan = this.props.columnSpan || 6;
    var bootstrapClasses = this.getBootStrapClassSet({'xs': 12, 'sm': 12, 'md': columnSpan, 'lg': columnSpan}); 
    return (
      <div className={bootstrapClasses}>{this.props.children}</div>
    );
  }
});

//tentative for dynamic N columns layout, this is probably the wrong way to do it!
var getMultiColumnsLayout = function(totColumns){
  return function(locals){
    //layouts in two columns
    var bootstrapColumnWidth = 12;
    var columnSpan = bootstrapColumnWidth/totColumns;
    var order = locals.order || Object.keys(locals.inputs);
    var totInputs = order.length;
    var totRows = totInputs/totColumns;
    var inputPerColumn = totInputs/totRows;
    var inputInCurrentColumn = 0;
    var groupedControls = [[]];
    for (var i = 0; i < order.length; i++) {
      var currentChild = (<LayoutColumn key={i} columnSpan={columnSpan}>{locals.inputs[order[i]]}</LayoutColumn>);
      if (inputInCurrentColumn == inputPerColumn) {
        groupedControls.push([]);
        inputInCurrentColumn = 0;
      }
      groupedControls[groupedControls.length-1].push(currentChild);
      inputInCurrentColumn++;
    }
    var layoutNodes = groupedControls.map(function (controls, rowId) {
      return (
        <LayoutRow key={rowId}>
          {controls}
        </LayoutRow>
      );
    });
    return (
      <div>
        <fieldset>
          <legend>{locals.label}</legend>
          {layoutNodes}
        </fieldset>
      </div>
    );
  };
};

module.exports = {
  getMultiColumnsLayout: getMultiColumnsLayout
}