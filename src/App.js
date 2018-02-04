// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator - figure out what this is doing!
const getItems = count => {
  return (
    Array.from({ length: count }, (v,k) => k).map(k => ({
      id: `item-${k}`,
      content: `item ${k}`
    }))
  );
}

// a function to help with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // basic styles
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  //change bg color if dragging
  background: isDragging ? "lightgreen" : "grey",
  //styles we need to apply on draggables
  ...draggableStyle

});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

type AppProps { };

type AppState { };

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(10)

    };

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    //dropped outside the list
    if(!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  // normally you would split things out into separate components.
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        
    );
  }

}


export default App;
