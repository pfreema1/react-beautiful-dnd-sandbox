// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { Motion, spring } from "react-motion";

interface CardContainerProps {
  dragStarted: boolean;
  dragStartHandled(): void;
  item: Item;
}

interface CardContainerState {
  dragStarted: boolean;
  key: number;
  startRotation: boolean;
}

interface Item {
  id: string;
}

const Card = styled.div`
  user-select: none;
  padding: 16px;
  margin: 0 0 8px 0;
`;

let maxRotDeg = 20;

class CardContainer extends React.Component<
  CardContainerProps,
  CardContainerState
> {
  constructor(props: CardContainerProps) {
    super(props);

    this.state = {
      dragStarted: props.dragStarted,
      key: 10,
      startRotation: false
    };
  }

  componentWillReceiveProps(nextProps: CardContainerProps) {
    if (nextProps.dragStarted !== this.state.dragStarted) {
      this.setState({
        dragStarted: nextProps.dragStarted
      });
    }
  }

  getItemStyle = (isDragging: boolean, draggableStyle, rotDeg: number) => {
    console.log("rotDeg:  ", rotDeg);
    console.log("maxRotDeg:  ", maxRotDeg);
    if (rotDeg > maxRotDeg - 2) {
      //case: if the interpolated rotDeg is close to the maxRotDeg lets reverse it
      maxRotDeg = 0;
      console.log("rotDeg > maxRotDeg - 2");
    } else if (rotDeg == 0) {
      maxRotDeg = 20;
    }

    return {
      //change bg color if dragging
      background: isDragging ? "lightgreen" : "grey",

      //styles we need to apply on draggables
      ...draggableStyle,
      transform:
        draggableStyle.transform + " rotate(" + parseInt(rotDeg) + "deg)"
    };
  };

  handleDragStarted = () => {
    // console.log("handling drag STARTED IENIDNIDD");
    this.setState({
      key: this.state.key + 1,
      startRotation: true
    });

    //reset state in parent
    this.props.dragStartHandled();
  };

  render() {
    const { provided } = this.props;
    const { snapshot } = this.props;
    return (
      <div>
        <Motion
          key={this.state.key}
          defaultStyle={{ rotDeg: 0 }}
          style={{
            rotDeg: this.state.startRotation ? spring(maxRotDeg) : spring(0)
          }}
        >
          {interpStyle => {
            return (
              <Card
                innerRef={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                //function to handle conditional styles
                style={this.getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style,
                  interpStyle.rotDeg
                )}
              >
                {/*listen for drag start and play animation*/}
                {this.state.dragStarted ? this.handleDragStarted() : null}
                meow {this.props.item.id}
              </Card>
            );
          }}
        </Motion>
        {provided.placeholder}
      </div>
    );
  }
}

export default CardContainer;
