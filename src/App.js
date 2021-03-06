// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CardContainer from "./Containers/CardContainer";

// fake data generator - returns an array of objects of size 'count'
const getItems = count => {
  return Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));
};

// a function to help with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: "8px",
  width: 250
});

/* 
      TYPE DEFINITIONS
*/

interface AppProps {}

interface AppState {
  items: ItemObject[];
  dragStarted: boolean;
}

interface ItemObject {
  id: string;
  content: string;
}

type DragStart = {|
  draggableId: DraggableId,
  type: TypeId,
  source: DraggableLocation
|};

type DropResult = {|
  draggableId: DraggableId,
  type: TypeId,
  source: DraggableLocation,
  // may not have any destination (drag to nowhere)
  destination: ?DraggableLocation
|};

type Id = string;
type DroppableId = Id;
type DraggableId = Id;
type TypeId = Id;
type DraggableLocation = {|
  droppableId: DroppableId,
  // the position of the droppable within a droppable
  index: number
|};

/*
    ------------------------------------------------------------
*/

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      items: getItems(2),
      dragStarted: false
    };

    // this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragStart = (initial: DragStart): void => {
    // console.log("onDragStart called!!!");
    // console.log("initial:  ", initial);

    this.setState({
      dragStarted: true
    });
  };

  dragStartHandled = (): void => {
    this.setState({
      dragStarted: false
    });
  };

  /* 
     This runs when the item is finished moving (not when the use lets go of the item)
  */
  onDragEnd = (result: DropResult): void => {
    // console.log("onDragEnd being called");
    // console.log("result:  ", result);

    //dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  };

  // normally you would split things out into separate components.
  render() {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
      >
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                // for every item, make a <Draggable> component
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => {
                    return (
                      <CardContainer
                        item={item}
                        dragStartHandled={this.dragStartHandled}
                        dragStarted={this.state.dragStarted}
                        provided={provided}
                        snapshot={snapshot}
                      />
                    );
                  }}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default App;
