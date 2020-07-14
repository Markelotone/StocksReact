import React from 'react';

import StockList from '../Components/Stocks'
import Stock from '../Components/Stock'

class Option extends React.Component { // this class is intended to override the component that is displayed under the stocks tab
    constructor(props) {
        super(props)
        this.state = {
            isStockListState: true,
            isStockState: false,
            stock: {}
        }
      }

      triggerAddChild = (row) => { // first click will hide the Stock list which is the Parent, the detail page is the child
        this.setState({
          ...this.state,
          isStockListState: false,
          isStockState: true,
          stock: row
        })
      }

      triggerRestoreParent = () => { // second click will hide stock detail list(child) and bring back Stock List(parent)
        this.setState({
            ...this.state,
            isStockListState: true,
            isStockState: false,
        })
      }

      render() { //  will hold two components, one hidden and one displayed based off click events triggered
        return (
          <div>
            {this.state.isStockListState && <StockList addChild={this.triggerAddChild}/>}
            {this.state.isStockState && <Stock restoreParent={this.triggerRestoreParent} {...this.state.stock}/>}
          </div>
        )
      }
}

export default Option